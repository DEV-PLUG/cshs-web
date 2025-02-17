import withHandler from "@libs/server/withHandler";
import client from "@libs/server/client";
import { getServerSession } from "next-auth";
import getServerSessionCM from "@libs/server/session";
import { NextResponse } from "next/server";

// Get all todos of the user
async function GetHandler(request:Request) {
  const session = await getServerSessionCM();
  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get('search');
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');
  
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

  const beforeTodo = await client.todo.findMany({
    where: {
      OR: search ? [
        {
          title: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ] : undefined,
      // OR: search ? [
      //   {
      //     title: {
      //       search: search
      //     }
      //   },
      //   {
      //     description: {
      //       search: search
      //     }
      //   }
      // ] : []
      receiver: {
        email: session.user.email
      },
      status: 0
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      deadline: true,
      sender: {
        select: {
          name: true,
          profile: true
        }
      },
      receiver: {
        select: {
          name: true,
          profile: true
        }
      },
      status: true,
      type: true
    },
    orderBy: orderObject,
    take: 100
  });

  const finishedTodo = await client.todo.findMany({
    where: {
      OR: search ? [
        {
          title: {
            contains: search
          }
        },
        {
          description: {
            contains: search
          }
        }
      ] : undefined,
      // OR: search ? [
      //   {
      //     title: {
      //       search: search
      //     }
      //   },
      //   {
      //     description: {
      //       search: search
      //     }
      //   }
      // ] : []
      receiver: {
        email: session.user.email
      },
      status: 1,
    },
    select: {
      id: true,
      title: true,
      description: true,
      createdAt: true,
      deadline: true,
      sender: {
        select: {
          name: true,
          profile: true
        }
      },
      receiver: {
        select: {
          name: true,
          profile: true
        }
      },
      status: true,
      type: true
    },
    orderBy: orderObject,
    take: 100
  });

  return NextResponse.json({
    success: true,
    todo: {
      before: beforeTodo,
      finished: finishedTodo
    }
  }, { status: 200 });
}

// Mark or unmark todo as done
async function PutHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const todo = await client.todo.findUnique({
    where: {
      id: req.id
    },
    select: {
      id: true,
      receiver: {
        select: {
          email: true
        }
      },
      sender: {
        select: {
          email: true
        }
      },
      status: true
    }
  });
  if(!todo) {
    return NextResponse.json({
      success: false,
      message: 'Todo not found'
    }, { status: 404 });
  }
  if(todo.receiver?.email !== session.user.email) {
    return NextResponse.json({
      success: false,
      message: 'You are not the receiver of this todo'
    }, { status: 400 });
  }

  if(todo.status === 0) {
    await client.todo.update({
      where: {
        id: req.id
      },
      data: {
        status: 1
      }
    });
  }
  else if(todo.status === 1) {
    await client.todo.update({
      where: {
        id: req.id
      },
      data: {
        status: 0
      }
    });
  }

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

// Delete todo
async function DeleteHandler(request:Request) {
  const session = await getServerSessionCM();
  const req = await request.json();

  const todo = await client.todo.findUnique({
    where: {
      id: req.id
    },
    select: {
      id: true,
      receiver: {
        select: {
          email: true
        }
      },
      status: true
    }
  });
  if(!todo) {
    return NextResponse.json({
      success: false,
      message: 'Todo not found'
    }, { status: 404 });
  }
  if(todo.receiver?.email !== session.user.email) {
    return NextResponse.json({
      success: false,
      message: 'You are not the receiver of this todo'
    }, { status: 400 });
  }

  await client.todo.delete({
    where: {
      id: req.id
    }
  });

  return NextResponse.json({
    success: true
  }, { status: 200 });
}

export const GET = withHandler({ method: "GET", fn: GetHandler });
export const PUT = withHandler({ method: "PUT", fn: PutHandler });
export const DELETE = withHandler({ method: "DELETE", fn: DeleteHandler });