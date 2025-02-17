import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get meals of today
async function GetHandler(request: Request) {
  const session = await getServerSessionCM();

  const user = await client.user.findUnique({
    where: {
      email: session.user.email
    },
    select: {
      affiliationSchool: {
        select: {
          id: true,
          ATPT_OFCDC_SC_CODE: true,
          SD_SCHUL_CODE: true
        }
      }
    }
  });

  if (!user || !user.affiliationSchool) {
    return NextResponse.json({
      success: false,
      message: '사용자 정보를 찾을 수 없어요'
    }, { status: 404 });
  }

  const school = user.affiliationSchool;
  const date = new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
  const today = new Date(date);
  const year = today.getFullYear();
  const month = today.getMonth()+1;
  const day = today.getDate();

  const formatDate = year+""+(("00"+month.toString()).slice(-2))+""+(("00"+day.toString()).slice(-2));

  const existingMeal = await client.meal.findFirst({
    where: {
      affiliationSchoolId: school.id,
      date: formatDate
    }
  });

  if (existingMeal) {
    return NextResponse.json({
      success: true,
      meal: existingMeal
    }, { status: 200 });
  }
  
  const mealResponse = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=1&pSize=100&ATPT_OFCDC_SC_CODE=${school.ATPT_OFCDC_SC_CODE}&SD_SCHUL_CODE=${school.SD_SCHUL_CODE}&MLSV_YMD=${formatDate}&KEY=${process.env.NEIS_API_KEY}`);

  if (!mealResponse.ok) {
    return NextResponse.json({
      success: false,
      message: '식단 정보를 가져오는 데 실패했습니다'
    }, { status: 400 });
  }
  const mealData = await mealResponse.json();

  if(mealData.RESULT?.MESSAGE === '해당하는 데이터가 없습니다.') {
    await client.meal.create({
      data: {
        affiliationSchoolId: school.id,
        date: date
      }
    });

    return NextResponse.json({
      success: false,
      message: '식단 정보를 찾을 수 없어요'
    }, { status: 404 });
  }

  if (mealData.mealServiceDietInfo) {
    const mealRows = mealData.mealServiceDietInfo[1].row;
    let breakfast = null;
    let lunch = null;
    let dinner = null;

    for (const mealInfo of mealRows) {
      if (mealInfo.MMEAL_SC_NM === '조식') {
        breakfast = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
      } else if (mealInfo.MMEAL_SC_NM === '중식') {
        lunch = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
      } else if (mealInfo.MMEAL_SC_NM === '석식') {
        dinner = mealInfo.DDISH_NM.replace(/\s*\(.*?\)\s*/g, '').replaceAll('<br/>', '\n');
      }
    }

    const mealCreate = await client.meal.create({
      data: {
        affiliationSchoolId: school.id,
        date: mealRows[0].MLSV_YMD,
        breakfast: breakfast,
        lunch: lunch,
        dinner: dinner
      }
    });

    return NextResponse.json({
      success: true,
      meal: mealCreate
    }, { status: 200 });
  } else {
    return NextResponse.json({
      success: false,
      message: '식단 정보를 찾을 수 없어요'
    }, { status: 404 });
  }
}

export const GET = withHandler({ method: "GET", fn: GetHandler });