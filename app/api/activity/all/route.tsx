import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";
import formatedDate from "@libs/client/formated-date";

// Get all activity of the user
async function GetHandler(request:Request) {
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  const date = searchParams.get('date');
  
  let orderObject:{} = { updatedAt: 'desc' };
  if (sort && sort !== 'createdAt' && sort !== 'deadline' && sort !== 'updatedAt') {
    return NextResponse.json({
      success: false,
      message: 'Invalid sort value'
    }, { status: 400 });
  }
  if (order && order !== 'asc' && order !== 'desc') {
    return NextResponse.json({
      success: false,
      message: 'Invalid sort order'
    }, { status: 400 });
  }
  if(sort && order) {
    orderObject = {
      [sort]: order
    };
  }

  const dateCondition = date ? date : formatedDate(new Date().toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" }));

  const beforeActivity = await client.activity.findMany({
    where: {
      AND: [
        {
          OR: search ? [
            {
              content: {
                contains: search
              }
            },
            {
              writer: {
                name: {
                  contains: search
                }
              }
            },
            {
              relation: {
                some: {
                  user: {
                    name: {
                      contains: search
                    }
                  }
                }
              }
            },
            { 
              place: {
                place: {
                  contains: search
                }
              }
            },
            {
              teacher: {
                name: {
                  contains: search
                }
              }
            }
          ] : undefined,
        }
      ],
      date: dateCondition,
      status: 0,
    },
    select: {
      id: true,
      content: true,
      writer: {
        select: {
          name: true,
          profile: true,
          id: true,
          grade: true,
          class: true,
          number: true
        }
      },
      relation: {
        select: {
          user: {
            select: {
              name: true,
              profile: true,
              id: true,
              grade: true,
              class: true,
              number: true
            }
          }
        }
      },
      createdAt: true,
      perio: true,
      date: true,
      teacher: {
        select: {
          name: true,
          profile: true
        }
      },
      place: {
        select: {
          place: true
        }
      },
      status: true
    },
    orderBy: orderObject
  });

  const finishedActivity = await client.activity.findMany({
    where: {
      AND: [
        {
          OR: search ? [
            {
              content: {
                contains: search
              }
            },
            {
              writer: {
                name: {
                  contains: search
                }
              }
            },
            {
              relation: {
                some: {
                  user: {
                    name: {
                      contains: search
                    }
                  }
                }
              }
            },
            { 
              place: {
                place: {
                  contains: search
                }
              }
            },
            {
              teacher: {
                name: {
                  contains: search
                }
              }
            }
          ] : undefined,
        }
      ],
      date: dateCondition,
      status: {
        gte: 1
      }
    },
    select: {
      id: true,
      content: true,
      writer: {
        select: {
          name: true,
          profile: true,
          id: true,
          grade: true,
          class: true,
          number: true
        }
      },
      relation: {
        select: {
          user: {
            select: {
              name: true,
              profile: true,
              id: true,
              grade: true,
              class: true,
              number: true
            }
          }
        }
      },
      createdAt: true,
      perio: true,
      date: true,
      teacher: {
        select: {
          name: true,
          profile: true,
          id: true
        }
      },
      place: {
        select: {
          place: true
        }
      },
      status: true
    },
    orderBy: orderObject,
    take: 100
  });

  return NextResponse.json({
    success: true,
    activity: {
      before: beforeActivity,
      finished: finishedActivity
    }
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });