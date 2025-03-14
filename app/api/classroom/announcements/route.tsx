import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get recent announcements from google classroom
async function GetHandler() {
  const session = await getServerSessionCM();
  
  const user = await client.user.findMany({
    where: {
      email: session.user.email
    },
    select: {
      id: true,
      classroomCourse: {
        select: {
          course: {
            select: {
              courseId: true
            }
          }
        }
      },
      google: {
        select: {
          id: true
        }
      },
      type: true
    }
  });
  if(user.length <= 0) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }
  if(user[0].type !== 0) {
    return NextResponse.json({
      success: false,
      message: '학생만 이용할 수 있어요'
    }, { status: 400 });
  }

  if(!user[0].google) {
    return NextResponse.json({
      success: false,
      message: '구글 계정을 연결해주세요'
    }, { status: 400 });
  }

  const courses = user[0].classroomCourse;
  if(courses.length <= 0) {
    // return NextResponse.json({
    //   success: true,
    //   announcements: []
    // }, { status: 200 });
    return NextResponse.json({
      success: false,
      message: '학교 계정을 연결해주세요'
    }, { status: 400 });
  }

  const announcements = await client.classroomAnnoucement.findMany({
    where: {
      course: {
        courseId: {
          in: courses.map(course => course.course.courseId)
        }
      }
    },
    select: {
      id: true,
      content: true,
      postCreationTime: true,
      postUpdateTime: true,
      writer: true,
      course: {
        select: {
          name: true
        }
      },
      materials: true,
      dueDate: true,
      type: true,
      title: true,
      alternateLink: true
    },
    orderBy: {
      postCreationTime: 'desc'
    },
    take: 10
  });

  return NextResponse.json({
    success: true,
    announcements
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });