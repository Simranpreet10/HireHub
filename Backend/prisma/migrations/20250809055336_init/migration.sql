-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile_no" TEXT,
    "work_status" TEXT,
    "user_type" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_joined" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "profile_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "skills" TEXT,
    "marks_10" DOUBLE PRECISION,
    "marks_12" DOUBLE PRECISION,
    "marks_graduation" DOUBLE PRECISION,
    "location" TEXT,
    "email" TEXT,
    "resume" TEXT,
    "additional_info" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateTable
CREATE TABLE "public"."Recruiter" (
    "recruiter_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_joined" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recruiter_pkey" PRIMARY KEY ("recruiter_id")
);

-- CreateTable
CREATE TABLE "public"."Company" (
    "company_id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "company_info" TEXT,
    "company_logo" TEXT,
    "location" TEXT,
    "industry_type" TEXT,
    "website" TEXT,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("company_id")
);

-- CreateTable
CREATE TABLE "public"."Job" (
    "job_id" SERIAL NOT NULL,
    "recruiter_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "job_title" TEXT NOT NULL,
    "description" TEXT,
    "ctc" DOUBLE PRECISION,
    "location" TEXT,
    "posted_date" TIMESTAMP(3) NOT NULL,
    "closing_date" TIMESTAMP(3),
    "eligibility" TEXT,
    "employment_type" TEXT,
    "experience_required" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("job_id")
);

-- CreateTable
CREATE TABLE "public"."Application" (
    "application_id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "resume" TEXT,
    "status" TEXT NOT NULL,
    "apply_date" TIMESTAMP(3) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("application_id")
);

-- CreateTable
CREATE TABLE "public"."ResumeAlt" (
    "resume_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "parsed_data" TEXT,
    "ai_score" DOUBLE PRECISION,
    "recommendations" TEXT,

    CONSTRAINT "ResumeAlt_pkey" PRIMARY KEY ("resume_id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "notification_type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "admin_id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "date_joined" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_user_id_key" ON "public"."Recruiter"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Recruiter_email_key" ON "public"."Recruiter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "public"."Admin"("email");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recruiter" ADD CONSTRAINT "Recruiter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Recruiter" ADD CONSTRAINT "Recruiter_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_recruiter_id_fkey" FOREIGN KEY ("recruiter_id") REFERENCES "public"."Recruiter"("recruiter_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Job" ADD CONSTRAINT "Job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."Company"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."Job"("job_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Application" ADD CONSTRAINT "Application_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ResumeAlt" ADD CONSTRAINT "ResumeAlt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
