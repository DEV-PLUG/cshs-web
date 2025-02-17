import refreshAccessToken from "./refresh-access-token";
import CryptoJS from 'crypto-js';
import client from "@libs/server/client";

export default async function updateCourse(email:string) {
  let google = await client?.google.findMany({
    where: {
      user: {
        email: email
      }
    },
    select: {
      accessToken: true,
      refreshToken: true,
      expire: true
    }
  });

  if(!google || google.length <= 0) return;
  if(google[0].expire < new Date()) {
    google = await refreshAccessToken(email);
    if(!google || google.length <= 0) return;
  }

  const response = await fetch('https://classroom.googleapis.com/v1/courses', {
    headers: {
      Authorization: `Bearer ${CryptoJS.AES.decrypt(google[0].accessToken, process.env.CLASSROOM_CRYPTO_KEY!).toString(CryptoJS.enc.Utf8)}`
    }
  });
  if(!response.ok) return;

  const data = await response.json();

  data.courses?.forEach(async (course:any) => {
    const courseCreate = await client?.classroomCourse.upsert({
      where: {
        courseId: course.id
      },
      create: {
        courseId: course.id,
        name: course.name,
        description: course.descriptionHeading
      },
      update: {
        name: course.name,
        description: course.descriptionHeading
      }
    });

    const relation = await client?.classroomCourseRelation.findFirst({
      where: {
        courseId: courseCreate?.id,
        user: {
          email: email
        }
      }
    });
    if(!relation) {
      await client?.classroomCourseRelation.create({
        data: {
          course: {
            connect: {
              courseId: course.id
            }
          },
          user: {
            connect: {
              email: email
            }
          }
        }
      });
    }
  });

  return {
    success: true
  };
}