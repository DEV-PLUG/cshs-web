import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import updateCourse from "@libs/server/classroom/update-course";
import CryptoJS from "crypto-js";
import refreshAccessToken from "@libs/server/classroom/refresh-access-token";

// GPT USED IN THIS API
// AI 관련 기능이 포함되니 지속적인 모니터링이 필요합니다.

import OpenAI from "openai";
const openai = new OpenAI();

async function PostHandler() {

  // 오늘 마감인 할 일 알림 전송

  const curr = new Date();
  // 2. UTC 시간 계산
  const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);

  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = new Date(utc + (KR_TIME_DIFF));

  const currentHour = kr_curr.getHours();

  if (currentHour >= 8 && currentHour < 9) {
    const notificationUser = await client.user.findMany({
      where: {
        receivedTodo: {
          some: {
            status: 0,
            deadline: {
              gte: new Date(new Date(new Date().setFullYear(kr_curr.getFullYear(), kr_curr.getMonth(), kr_curr.getDate())).setHours(0, 0, 0, 0)),
              lte: new Date(new Date(new Date().setFullYear(kr_curr.getFullYear(), kr_curr.getMonth(), kr_curr.getDate())).setHours(23, 59, 59, 999))
            }
          }
        }
      },
      select: {
        notificationToken: true,
        id: true
      }
    });
  
    notificationUser.forEach(async (user:any) => {
      const todo_count = await client.todo.count({
        where: {
          status: 0,
          deadline: {
            gte: new Date(new Date(new Date().setFullYear(kr_curr.getFullYear(), kr_curr.getMonth(), kr_curr.getDate())).setHours(0, 0, 0, 0)),
            lte: new Date(new Date(new Date().setFullYear(kr_curr.getFullYear(), kr_curr.getMonth(), kr_curr.getDate())).setHours(23, 59, 59, 999))
          },
          receiverId: user.id
        }
      });
  
      await client.notification.create({
        data: {
          title: `오늘이 마감일인 할 일이 ${todo_count}개 있어요`,
          content: `하루를 시작하기에 앞서 오늘 할 일을 확인해보세요`,
          userId: user.id,
          link: '/d/home/todo'
        }
      });
  
      if(user.notificationToken) {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            to: user.notificationToken,
            title: `오늘이 마감일인 할 일이 ${todo_count}개 있어요`,
            body: `하루를 시작하기에 앞서 오늘 할 일을 확인해보세요`
          })
        });
      }
    });
  }

  // AI - 할 일 분석 및 자동 추가

  const announcement = await client.classroomAnnoucement.findMany({
    where: {
      analysed: false
    },
    select: {
      id: true,
      title: true,
      content: true,
      writer: true,
      type: true,
      dueDate: true,
      postCreationTime: true,
      course: {
        select: {
          courseId: true
        }
      }
    }
  });

  if(announcement.length <= 0) {
    return NextResponse.json({
      success: true
    }, { status: 200 });
  }
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      store: true,
      messages: [
        {"role": "user", "content": JSON.stringify(announcement)}
      ],
      functions: [{
        "name": "get_todo",
        "description": "선생님이 올린 공지를 분석하여 자동으로 학생에게 할 일을 추가해주는 역할. 하나의 공지 당 최대 하나의 할 일만 추가할 것. 수행평가, 과제 등의 행동이 필요한 중요 공지만 할 일로 추가하고 중요하지 않은 공지는 건너뛸 것.",
        "parameters": {
          "type": "object",
          "properties": {
            "todo": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "20자 이내 할 일의 제목"
                  },
                  "des": {
                    "type": "string",
                    "description": "2줄 이내 간략한 할 일의 설명"
                  },
                  "dueDate": {
                    "type": "string",
                    "description": "2025-12-31 형식의 마감일"
                  },
                  "courseId": {
                    "type": "number",
                    "description": "해당 공지의 courseId"
                  }
                }, 
                "required": ["title", "des", "courseId"]
              }, 
            }
          },
          "required": ["todo"]
        }
      }],
      function_call: {
        "name": "get_todo"
      },
    });

    if(completion["choices"][0]["message"].function_call?.arguments) {
      console.log(JSON.parse(completion["choices"][0]["message"].function_call?.arguments).todo);
      const todo = JSON.parse(completion["choices"][0]["message"].function_call?.arguments).todo;
      todo.forEach(async (todo:any) => {
        const user = await client.classroomCourseRelation.findMany({
          where: {
            course: {
              courseId: todo.courseId + ''
            }
          },
          select: {
            userId: true
          }
        });

        let userIds:number[] = [];
        user.forEach(async (user:any) => {
          userIds.push(user.userId);
        });
        await client.todo.createMany({
          data: userIds.map((userId:number) => {
            return {
              title: todo.title,
              description: todo.des,
              deadline: todo.dueDate ? new Date(todo.dueDate) : new Date(new Date().setDate(new Date().getDate() + 7)),
              receiverId: userId,
              type: 1,
              status: 0,
              senderId: userId
            }
          })
        });
      });
    }
  } catch(e) {
    console.log(e, 'Cron job with AI failed - TODO');
  }

  await client.classroomAnnoucement.updateMany({
    data: {
      analysed: true
    },
    where: {
      analysed: false
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler, isPrivate: false });