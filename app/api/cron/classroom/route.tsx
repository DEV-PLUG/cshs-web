import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import updateCourse from "@libs/server/classroom/update-course";
import CryptoJS from "crypto-js";
import refreshAccessToken from "@libs/server/classroom/refresh-access-token";

// Get announcements changes from google classroom
// 많은 외부 API가 사용되어, 문제 발생 가능성이 높으므로, 항상 로그를 모니터링하고 오류를 디버깅해야 합니다.
// 교사가 작성한 게시글만을 가져옵니다.
async function PostHandler(request:Request) {
  const courses = await client.classroomCourse.findMany({
    select: {
      id: true,
      courseId: true
    }
  });

  courses.forEach(async course => {
    const usersWithGoogleAccount = await client.user.findMany({
      where: {
        classroomCourse: {
          some: {
            course: {
              courseId: course.courseId
            }
          }
        },
        google: {
          isNot: null
        }
      },
      select: {
        id: true,
        email: true,
        google: {
          select: {
            accessToken: true,
            expire: true
          }
        }
      },
      take: 10
    });

    // console.log(usersWithGoogleAccount)
    
    for (let i = 0; i < usersWithGoogleAccount.length; i++) {
      const user = usersWithGoogleAccount[i];

      if(!user.google?.accessToken) continue;
      
      let accessToken = user.google.accessToken;
      if(user.google.expire < new Date()) {
        const refreshedToken = await refreshAccessToken(user.email);
        if(!refreshedToken || refreshedToken.length <= 0) continue;
        accessToken = refreshedToken[0].accessToken;
      }

      const response = await fetch('https://classroom.googleapis.com/v1/courses/' + course.courseId + '/announcements', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + CryptoJS.AES.decrypt(accessToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
        }
      });
      // console.log(response)

      if (!response.ok) {
        // await client.google.delete({
        //   where: {
        //     userId: user.id
        //   }
        // });
        continue;
      };

      const announcements = await response.json();
      if (!announcements?.announcements || announcements.announcements.length <= 0) continue;
      // console.log(announcements.announcements.length);

      const existingAnnouncements = await client.classroomAnnoucement.findMany({
        where: {
          announcementId: {
            in: announcements.announcements.map((announcement: any) => announcement.id)
          }
        },
        select: {
          announcementId: true
        }
      });

      const existingAnnouncementIds = new Set(existingAnnouncements.map(a => a.announcementId));

      const newAnnouncements = announcements.announcements.filter((announcement: any) => !existingAnnouncementIds.has(announcement.id));
      // console.log(newAnnouncements.length, 'new announcements');

      if (newAnnouncements.length > 0) {
        let data:any = [];
        for(let j = 0; j < newAnnouncements.length; j++) {
          const announcement = newAnnouncements[j];
          const teacherResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.courseId}/teachers/${announcement.creatorUserId}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + CryptoJS.AES.decrypt(accessToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
            }
          });
  
          if (!teacherResponse.ok) {
            continue;
          }
  
          const teacher = await teacherResponse.json();
          console.log(announcement)

          data.push({
            announcementId: announcement.id,
            courseId: course.id,
            content: announcement.text,
            writer: teacher.profile.name.fullName,
            profile: teacher.profile.photoUrl,
            postCreationTime: announcement.creationTime,
            postUpdateTime: announcement.updateTime,
            analysed: false,
            type: 0,
            materials: announcement.materials ? true : false
          });
        };

        await client.classroomAnnoucement.createMany({
          data: data
        });
      }
    }
  });

  courses.forEach(async course => {
    const usersWithGoogleAccount = await client.user.findMany({
      where: {
        classroomCourse: {
          some: {
            course: {
              courseId: course.courseId
            }
          }
        },
        google: {
          isNot: null
        }
      },
      select: {
        id: true,
        email: true,
        google: {
          select: {
            accessToken: true,
            expire: true
          }
        }
      },
      take: 10
    });

    // console.log(usersWithGoogleAccount)
    
    for (let i = 0; i < usersWithGoogleAccount.length; i++) {
      const user = usersWithGoogleAccount[i];

      if(!user.google?.accessToken) continue;
      
      let accessToken = user.google.accessToken;
      if(user.google.expire < new Date()) {
        const refreshedToken = await refreshAccessToken(user.email);
        if(!refreshedToken || refreshedToken.length <= 0) continue;
        accessToken = refreshedToken[0].accessToken;
      }

      const response = await fetch('https://classroom.googleapis.com/v1/courses/' + course.courseId + '/courseWork', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + CryptoJS.AES.decrypt(accessToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
        }
      });
      // console.log(response)

      // if (!response.ok) {
      //   // await client.google.delete({
      //   //   where: {
      //   //     userId: user.id
      //   //   }
      //   // });
      //   continue;
      // };

      const announcements = await response.json();
      if (!announcements?.courseWork || announcements.courseWork.length <= 0) continue;
      // console.log(announcements);

      const existingCourseWork = await client.classroomAnnoucement.findMany({
        where: {
          announcementId: {
            in: announcements.courseWork.map((courseWork: any) => courseWork.id)
          }
        },
        select: {
          announcementId: true
        }
      });

      const existingCourseWorkIds = new Set(existingCourseWork.map(a => a.announcementId));

      const newAnnouncements = announcements.courseWork.filter((announcement: any) => !existingCourseWorkIds.has(announcement.id));
      // console.log(newAnnouncements.length, 'new announcements');

      if (newAnnouncements.length > 0) {
        let data:any = [];
        for(let j = 0; j < newAnnouncements.length; j++) {
          const announcement = newAnnouncements[j];
          const teacherResponse = await fetch(`https://classroom.googleapis.com/v1/courses/${course.courseId}/teachers/${announcement.creatorUserId}`, {
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + CryptoJS.AES.decrypt(accessToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)
            }
          });
  
          if (!teacherResponse.ok) {
            continue;
          }
  
          const teacher = await teacherResponse.json();
          console.log(announcement)

          data.push({
            announcementId: announcement.id,
            courseId: course.id,
            content: announcement.description ? announcement.description : announcement.title,
            title: announcement.title,
            writer: teacher.profile.name.fullName,
            profile: teacher.profile.photoUrl,
            postCreationTime: announcement.creationTime,
            postUpdateTime: announcement.updateTime,
            analysed: false,
            type: 1,
            dueDate: announcement.dueDate && announcement.dueTime ? new Date(announcement.dueDate.year, announcement.dueDate.month - 1, announcement.dueDate.day, announcement.dueTime.hours ? announcement.dueTime.hours : 0, announcement.dueTime.minutes ? announcement.dueTime.minutes : 0).toISOString() : null,
            materials: announcement.materials ? true : false
          });
        };

        await client.classroomAnnoucement.createMany({
          data: data
        });
      }
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const POST = withHandler({ method: "POST", fn: PostHandler, isPrivate: false });