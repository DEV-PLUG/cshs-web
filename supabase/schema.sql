

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Activity" (
    "id" integer NOT NULL,
    "teacherId" integer NOT NULL,
    "writerId" integer NOT NULL,
    "content" "text" NOT NULL,
    "perio" "text" NOT NULL,
    "date" "text" NOT NULL,
    "placeId" integer NOT NULL,
    "status" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Activity" OWNER TO "prisma";


CREATE TABLE IF NOT EXISTS "public"."ActivityRelation" (
    "id" integer NOT NULL,
    "userId" integer NOT NULL,
    "activityId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ActivityRelation" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."ActivityRelation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."ActivityRelation_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."ActivityRelation_id_seq" OWNED BY "public"."ActivityRelation"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."Activity_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Activity_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Activity_id_seq" OWNED BY "public"."Activity"."id";



CREATE TABLE IF NOT EXISTS "public"."ClassroomAnnoucement" (
    "id" integer NOT NULL,
    "announcementId" "text" NOT NULL,
    "writer" "text" NOT NULL,
    "profile" "text",
    "title" "text",
    "content" "text" NOT NULL,
    "courseId" integer NOT NULL,
    "type" integer,
    "analysed" boolean NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "postCreationTime" timestamp(3) without time zone NOT NULL,
    "postUpdateTime" timestamp(3) without time zone NOT NULL,
    "materials" boolean,
    "alternateLink" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ClassroomAnnoucement" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."ClassroomAnnoucement_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."ClassroomAnnoucement_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."ClassroomAnnoucement_id_seq" OWNED BY "public"."ClassroomAnnoucement"."id";



CREATE TABLE IF NOT EXISTS "public"."ClassroomCourse" (
    "id" integer NOT NULL,
    "courseId" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "relationId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ClassroomCourse" OWNER TO "prisma";


CREATE TABLE IF NOT EXISTS "public"."ClassroomCourseRelation" (
    "id" integer NOT NULL,
    "courseId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."ClassroomCourseRelation" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."ClassroomCourseRelation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."ClassroomCourseRelation_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."ClassroomCourseRelation_id_seq" OWNED BY "public"."ClassroomCourseRelation"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."ClassroomCourse_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."ClassroomCourse_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."ClassroomCourse_id_seq" OWNED BY "public"."ClassroomCourse"."id";



CREATE TABLE IF NOT EXISTS "public"."Feedback" (
    "id" integer NOT NULL,
    "content" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Feedback" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Feedback_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Feedback_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Feedback_id_seq" OWNED BY "public"."Feedback"."id";



CREATE TABLE IF NOT EXISTS "public"."Google" (
    "id" integer NOT NULL,
    "userId" integer NOT NULL,
    "accessToken" "text" NOT NULL,
    "refreshToken" "text" NOT NULL,
    "expire" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Google" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Google_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Google_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Google_id_seq" OWNED BY "public"."Google"."id";



CREATE TABLE IF NOT EXISTS "public"."Group" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "schoolId" integer NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Group" OWNER TO "prisma";


CREATE TABLE IF NOT EXISTS "public"."GroupRelation" (
    "id" integer NOT NULL,
    "userId" integer NOT NULL,
    "groupId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."GroupRelation" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."GroupRelation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."GroupRelation_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."GroupRelation_id_seq" OWNED BY "public"."GroupRelation"."id";



CREATE SEQUENCE IF NOT EXISTS "public"."Group_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Group_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Group_id_seq" OWNED BY "public"."Group"."id";



CREATE TABLE IF NOT EXISTS "public"."Log" (
    "id" integer NOT NULL,
    "type" character varying(40) NOT NULL,
    "description" "text",
    "relation" integer,
    "ip" character varying(100),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Log" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Log_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Log_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Log_id_seq" OWNED BY "public"."Log"."id";



CREATE TABLE IF NOT EXISTS "public"."Meal" (
    "id" integer NOT NULL,
    "affiliationSchoolId" integer NOT NULL,
    "date" "text" NOT NULL,
    "breakfast" "text",
    "lunch" "text",
    "dinner" "text",
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Meal" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Meal_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Meal_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Meal_id_seq" OWNED BY "public"."Meal"."id";



CREATE TABLE IF NOT EXISTS "public"."Notification" (
    "id" integer NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "link" "text",
    "image" "text",
    "userId" integer NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Notification" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Notification_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Notification_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Notification_id_seq" OWNED BY "public"."Notification"."id";



CREATE TABLE IF NOT EXISTS "public"."Place" (
    "id" integer NOT NULL,
    "affiliationSchoolId" integer NOT NULL,
    "code" "text",
    "place" "text" NOT NULL,
    "type" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Place" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Place_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Place_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Place_id_seq" OWNED BY "public"."Place"."id";



CREATE TABLE IF NOT EXISTS "public"."School" (
    "id" integer NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "image" "text" NOT NULL,
    "level" integer NOT NULL,
    "region" "text" NOT NULL,
    "address" "text" NOT NULL,
    "ATPT_OFCDC_SC_CODE" "text" NOT NULL,
    "SD_SCHUL_CODE" "text" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."School" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."School_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."School_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."School_id_seq" OWNED BY "public"."School"."id";



CREATE TABLE IF NOT EXISTS "public"."Timetable" (
    "id" integer NOT NULL,
    "affiliationSchoolId" integer NOT NULL,
    "date" "text" NOT NULL,
    "perio" integer NOT NULL,
    "subject" "text" NOT NULL,
    "class" integer NOT NULL,
    "grade" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Timetable" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Timetable_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Timetable_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Timetable_id_seq" OWNED BY "public"."Timetable"."id";



CREATE TABLE IF NOT EXISTS "public"."Todo" (
    "id" integer NOT NULL,
    "title" character varying(40) NOT NULL,
    "description" "text",
    "type" integer NOT NULL,
    "status" integer NOT NULL,
    "deadline" timestamp(3) without time zone,
    "receiverId" integer,
    "senderId" integer NOT NULL,
    "mainTodoId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."Todo" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."Todo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."Todo_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."Todo_id_seq" OWNED BY "public"."Todo"."id";



CREATE TABLE IF NOT EXISTS "public"."User" (
    "id" integer NOT NULL,
    "provider" "text" NOT NULL,
    "email" "text" NOT NULL,
    "userId" "text" NOT NULL,
    "profile" "text",
    "type" integer NOT NULL,
    "name" "text" NOT NULL,
    "grade" integer,
    "class" integer,
    "number" integer,
    "password" "text",
    "notificationToken" "text",
    "seat" integer,
    "mobileToken" "text",
    "allowNotification" boolean DEFAULT true NOT NULL,
    "allowNightNotification" boolean DEFAULT false NOT NULL,
    "allowAI" boolean DEFAULT true NOT NULL,
    "mangedSchoolId" integer,
    "affiliationSchoolId" integer,
    "googleId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."User" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."User_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."User_id_seq" OWNED BY "public"."User"."id";



CREATE TABLE IF NOT EXISTS "public"."VerificationCode" (
    "id" integer NOT NULL,
    "code" character varying(6) NOT NULL,
    "userId" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE "public"."VerificationCode" OWNER TO "prisma";


CREATE SEQUENCE IF NOT EXISTS "public"."VerificationCode_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."VerificationCode_id_seq" OWNER TO "prisma";


ALTER SEQUENCE "public"."VerificationCode_id_seq" OWNED BY "public"."VerificationCode"."id";



ALTER TABLE ONLY "public"."Activity" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Activity_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ActivityRelation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ActivityRelation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ClassroomAnnoucement" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ClassroomAnnoucement_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ClassroomCourse" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ClassroomCourse_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ClassroomCourseRelation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ClassroomCourseRelation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Feedback" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Feedback_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Google" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Google_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Group" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Group_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."GroupRelation" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."GroupRelation_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Log" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Log_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Meal" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Meal_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Notification" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Notification_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Place" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Place_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."School" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."School_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Timetable" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Timetable_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."Todo" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."Todo_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."User" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."User_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."VerificationCode" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."VerificationCode_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."ActivityRelation"
    ADD CONSTRAINT "ActivityRelation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Activity"
    ADD CONSTRAINT "Activity_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ClassroomAnnoucement"
    ADD CONSTRAINT "ClassroomAnnoucement_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ClassroomCourseRelation"
    ADD CONSTRAINT "ClassroomCourseRelation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ClassroomCourse"
    ADD CONSTRAINT "ClassroomCourse_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Feedback"
    ADD CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Google"
    ADD CONSTRAINT "Google_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."GroupRelation"
    ADD CONSTRAINT "GroupRelation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Log"
    ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Meal"
    ADD CONSTRAINT "Meal_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Place"
    ADD CONSTRAINT "Place_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."School"
    ADD CONSTRAINT "School_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Timetable"
    ADD CONSTRAINT "Timetable_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Todo"
    ADD CONSTRAINT "Todo_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."VerificationCode"
    ADD CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "ClassroomAnnoucement_announcementId_key" ON "public"."ClassroomAnnoucement" USING "btree" ("announcementId");



CREATE UNIQUE INDEX "ClassroomCourse_courseId_key" ON "public"."ClassroomCourse" USING "btree" ("courseId");



CREATE UNIQUE INDEX "Google_userId_key" ON "public"."Google" USING "btree" ("userId");



CREATE UNIQUE INDEX "User_email_key" ON "public"."User" USING "btree" ("email");



CREATE UNIQUE INDEX "User_userId_key" ON "public"."User" USING "btree" ("userId");



CREATE UNIQUE INDEX "VerificationCode_code_key" ON "public"."VerificationCode" USING "btree" ("code");



CREATE UNIQUE INDEX "VerificationCode_userId_key" ON "public"."VerificationCode" USING "btree" ("userId");



ALTER TABLE ONLY "public"."ActivityRelation"
    ADD CONSTRAINT "ActivityRelation_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "public"."Activity"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."ActivityRelation"
    ADD CONSTRAINT "ActivityRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Activity"
    ADD CONSTRAINT "Activity_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "public"."Place"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Activity"
    ADD CONSTRAINT "Activity_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Activity"
    ADD CONSTRAINT "Activity_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ClassroomAnnoucement"
    ADD CONSTRAINT "ClassroomAnnoucement_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."ClassroomCourse"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ClassroomCourseRelation"
    ADD CONSTRAINT "ClassroomCourseRelation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."ClassroomCourse"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."ClassroomCourseRelation"
    ADD CONSTRAINT "ClassroomCourseRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Google"
    ADD CONSTRAINT "Google_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."GroupRelation"
    ADD CONSTRAINT "GroupRelation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Group"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."GroupRelation"
    ADD CONSTRAINT "GroupRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Group"
    ADD CONSTRAINT "Group_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Meal"
    ADD CONSTRAINT "Meal_affiliationSchoolId_fkey" FOREIGN KEY ("affiliationSchoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Place"
    ADD CONSTRAINT "Place_affiliationSchoolId_fkey" FOREIGN KEY ("affiliationSchoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Timetable"
    ADD CONSTRAINT "Timetable_affiliationSchoolId_fkey" FOREIGN KEY ("affiliationSchoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Todo"
    ADD CONSTRAINT "Todo_mainTodoId_fkey" FOREIGN KEY ("mainTodoId") REFERENCES "public"."Todo"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Todo"
    ADD CONSTRAINT "Todo_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."Todo"
    ADD CONSTRAINT "Todo_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_affiliationSchoolId_fkey" FOREIGN KEY ("affiliationSchoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."User"
    ADD CONSTRAINT "User_mangedSchoolId_fkey" FOREIGN KEY ("mangedSchoolId") REFERENCES "public"."School"("id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."VerificationCode"
    ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON UPDATE CASCADE ON DELETE RESTRICT;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
GRANT ALL ON SCHEMA "public" TO "prisma";



































































































































































































ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "prisma";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "prisma";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "prisma";






























RESET ALL;
