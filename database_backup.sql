--
-- PostgreSQL database dump
--

\restrict 0Eo6JxjfjuBD7kOKCEEaVSLFcaveO3f3saiPCAl7xRjmH9Stl7pjrYJ53ypfqBo

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avatar_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avatar_settings (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    base_color text DEFAULT 'blue'::text NOT NULL,
    accent_color text DEFAULT 'purple'::text NOT NULL,
    style text DEFAULT 'default'::text NOT NULL,
    accessory text
);


ALTER TABLE public.avatar_settings OWNER TO postgres;

--
-- Name: custom_todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_todos (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    date text NOT NULL,
    title text NOT NULL,
    completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.custom_todos OWNER TO postgres;

--
-- Name: day_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.day_notes (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    date text NOT NULL,
    content text NOT NULL
);


ALTER TABLE public.day_notes OWNER TO postgres;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    subject_id text NOT NULL,
    title text NOT NULL,
    date text NOT NULL,
    week integer NOT NULL,
    term integer,
    description text
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    subject_id text NOT NULL,
    assessment_id text NOT NULL,
    score integer
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    subject_id text NOT NULL,
    content text NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: streaks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.streaks (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    current_streak integer DEFAULT 0 NOT NULL,
    longest_streak integer DEFAULT 0 NOT NULL,
    last_study_date text,
    last_active_date text,
    last_check_date text,
    streak_freezes integer DEFAULT 2 NOT NULL,
    freezes_used_this_month integer DEFAULT 0 NOT NULL,
    freeze_days_remaining integer DEFAULT 2 NOT NULL,
    last_freeze_month integer
);


ALTER TABLE public.streaks OWNER TO postgres;

--
-- Name: study_time; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.study_time (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    date text NOT NULL,
    hours integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.study_time OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    subject_id text NOT NULL,
    week integer NOT NULL,
    term integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    estimated_minutes integer NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    due_date text NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: user_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_stats (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    total_points integer DEFAULT 0 NOT NULL,
    total_study_minutes integer DEFAULT 0 NOT NULL,
    total_tasks_completed integer DEFAULT 0 NOT NULL,
    total_pomodoro_sessions integer DEFAULT 0 NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    badges_earned jsonb DEFAULT '[]'::jsonb NOT NULL,
    daily_task_completions jsonb DEFAULT '{}'::jsonb NOT NULL,
    task_completion_times jsonb DEFAULT '[]'::jsonb NOT NULL,
    subject_study_minutes jsonb DEFAULT '{}'::jsonb NOT NULL,
    last_active_date text,
    showcased_badges jsonb DEFAULT '[]'::jsonb NOT NULL
);


ALTER TABLE public.user_stats OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: weekly_goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.weekly_goals (
    id character varying(36) DEFAULT gen_random_uuid() NOT NULL,
    user_id character varying(36) NOT NULL,
    hours integer DEFAULT 10 NOT NULL
);


ALTER TABLE public.weekly_goals OWNER TO postgres;

--
-- Data for Name: avatar_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avatar_settings (id, user_id, base_color, accent_color, style, accessory) FROM stdin;
\.


--
-- Data for Name: custom_todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_todos (id, user_id, date, title, completed) FROM stdin;
\.


--
-- Data for Name: day_notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.day_notes (id, user_id, date, content) FROM stdin;
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams (id, user_id, subject_id, title, date, week, term, description) FROM stdin;
68fc0876-8106-4e24-8345-6e07519173b3	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	Math Term 1 Test	2026-03-23	9	1	Covers linear equations, graphs, and trigonometry basics
6cc4be2a-1593-4c79-a37f-b60b746ff987	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	Science Term 1 Test	2026-03-24	9	1	Covers cells, genetics, and evolution
2759f15e-7d65-4a11-a407-4d90e58bf542	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	History Term 1 Test	2026-03-25	9	1	WWI, WWII origins and key events
d2603027-4526-49bb-bce5-03293324dcfe	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	English Term 1 Test	2026-03-26	9	1	Novel study and essay writing
2679ae34-3100-4c51-848b-39481762645c	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	Math Semester Exam	2026-05-31	17	2	Comprehensive exam covering all semester topics
d2b3ae90-744a-420b-9fe2-e1244a3e40f5	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	Science Semester Exam	2026-06-01	17	2	Comprehensive exam covering all semester topics
e30330cb-bff5-4dc6-b8a9-3c22bc9828f9	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	History Semester Exam	2026-06-02	17	2	Comprehensive exam covering all semester topics
870db2ed-856a-4c50-991f-7befe2d6192e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	English Semester Exam	2026-06-03	17	2	Essay and textual analysis exam
4eba4eb8-34f7-4012-a44e-00add1eab8d0	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	Math Term 1 Test	2026-03-23	9	1	Covers linear equations, graphs, and trigonometry basics
e6de6c64-2fc9-497b-9384-a3f8d854bac2	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	Science Term 1 Test	2026-03-24	9	1	Covers cells, genetics, and evolution
debe184f-6696-4513-ab56-3d9a54b7d538	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	History Term 1 Test	2026-03-25	9	1	WWI, WWII origins and key events
d1ce0965-1775-4a98-8668-ac87ece1f2bf	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	English Term 1 Test	2026-03-26	9	1	Novel study and essay writing
05846d5a-b84c-4336-8056-babd725e3d7c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	Math Semester Exam	2026-05-31	17	2	Comprehensive exam covering all semester topics
acf48111-981f-4e3d-9066-6ad02b890d3c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	Science Semester Exam	2026-06-01	17	2	Comprehensive exam covering all semester topics
f889dd53-ec34-45b8-b059-ddc7b08c21ed	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	History Semester Exam	2026-06-02	17	2	Comprehensive exam covering all semester topics
bac41d19-8e62-4d08-ab42-d3a5947488ae	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	English Semester Exam	2026-06-03	17	2	Essay and textual analysis exam
\.


--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, user_id, subject_id, assessment_id, score) FROM stdin;
\.


--
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notes (id, user_id, subject_id, content, updated_at) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
tj8-c1hNayu9nL42VqezhDGh1c9puDs3	{"cookie":{"originalMaxAge":604800000,"expires":"2026-02-06T10:15:02.920Z","secure":false,"httpOnly":true,"path":"/"},"userId":"2511ade0-a54f-45c7-a7ca-efa8ce8a4fef"}	2026-02-06 10:15:13
8rWGdS9uM5nts1pxo86DWPvdwrRsPY0_	{"cookie":{"originalMaxAge":604800000,"expires":"2026-02-06T10:18:56.187Z","secure":false,"httpOnly":true,"path":"/"},"userId":"c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728"}	2026-02-06 10:19:19
\.


--
-- Data for Name: streaks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.streaks (id, user_id, current_streak, longest_streak, last_study_date, last_active_date, last_check_date, streak_freezes, freezes_used_this_month, freeze_days_remaining, last_freeze_month) FROM stdin;
\.


--
-- Data for Name: study_time; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.study_time (id, user_id, date, hours) FROM stdin;
\.


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tasks (id, user_id, subject_id, week, term, title, description, estimated_minutes, completed, due_date) FROM stdin;
a5bbee1c-5263-4f86-b29a-5b44724dce56	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	1	1	Problem Solving & Real Numbers	Polya's problem solving steps and the real number system	74	f	2026-01-25
da09085f-6e14-486b-bf52-54a420ec0b06	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	2	1	Laws of Exponents	Index laws for multiplying, dividing, and raising powers	68	f	2026-02-01
627ad94d-20ee-48c4-8af6-4703354964da	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	3	1	Units & Measurements	Metric conversions and compound measures	57	f	2026-02-08
32cc5c91-6437-426e-af10-765d7f2eaad4	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	4	1	Surds & Radicals	Simplifying surds and rationalising denominators	69	f	2026-02-15
122326f8-8143-4ca6-b159-63074eb92baf	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	5	1	Absolute Value	Solving absolute value equations and inequalities	63	f	2026-02-22
481b05a4-773e-4bd5-910a-32630c082552	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	6	1	Patterns & Generalisations	Finding patterns and writing algebraic rules	64	f	2026-03-01
9771448d-a1e6-4499-b6c4-163ac982e8d2	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	7	1	NAPLAN Preparation	Review of number, algebra, measurement, and statistics	63	f	2026-03-08
6a79f700-345b-443a-9874-33e2dd080416	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	8	1	Coordinate Geometry	Distance, midpoint, and gradient formulas	66	f	2026-03-15
a7fe0127-7188-43c1-b173-dd231ee9ad3c	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	9	1	Linear Equations & Systems	Solving linear equations and simultaneous equations	66	f	2026-03-22
9d5ee4ef-7558-4d13-a8e9-a733bf2afd27	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	10	2	Algebra Review	Consolidating algebraic skills and techniques	59	f	2026-04-12
3a4c40a2-cf4d-4f4b-b2da-9bc20444736a	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	11	2	Relations & Functions	Understanding domain, range, and function notation	47	f	2026-04-19
67da5a8e-10f5-45cf-8583-f7c299b1c51f	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	12	2	Quadratic Expressions	Expanding, factorising, and completing the square	68	f	2026-04-26
36a7ad02-dbc7-4faa-b9e8-d14959902d8c	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	13	2	Quadratic Graphs	Graphing parabolas and key features in different forms	49	f	2026-05-03
033f5e0e-c263-4e0a-a106-0631ae68f93e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	14	2	Quadratic Equations	Solving using factorisation and the quadratic formula	72	f	2026-05-10
4466ad87-956d-488c-ba87-28fb7ce573bc	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	15	2	Sequences	Arithmetic and geometric sequences	53	f	2026-05-17
bd84aea7-0d32-41cc-9dbb-733a394845b3	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	16	2	Formulas & Proportion	Rearranging formulas and direct/inverse proportion	51	f	2026-05-24
3742d24d-25fa-46dc-8ea0-1d5ab26050ce	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	math	17	2	Semester Exam Preparation	Comprehensive revision for semester exams	48	f	2026-05-31
1c29dbb7-a071-47e8-90d6-4fa8c6941ec6	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	1	1	Atomic Structure	History of atomic theory and parts of the atom	60	f	2026-01-25
b7f13671-10b3-4ffb-949c-9ff75da1485e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	2	1	Isotopes & Radioactivity	Isotopes, radioactive decay, and types of radiation	59	f	2026-02-01
2fb7c370-4095-46eb-8f4e-e2d7369ee3c1	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	3	1	Half-Life & Applications	Calculating half-life and uses of radioisotopes	70	f	2026-02-08
6a094c8a-7d74-428d-b8f4-83486b528099	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	4	1	Atomic Model Project	Consolidating atomic structure understanding	53	f	2026-02-15
b81fbbdc-dcc3-4ac2-baf1-c5c57fd879fc	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	5	1	Chemical Reactions	Signs of reactions and balancing equations	66	f	2026-02-22
1e008cfc-6a75-4902-b7ce-deb1aa6fa1d2	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	6	1	Types of Reactions	Synthesis, decomposition, combustion, neutralisation	67	f	2026-03-01
7eb06dca-34a6-42d7-bf1e-4d0afd15ad55	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	7	1	Electrolysis	Using electricity to decompose compounds	51	f	2026-03-08
2133fd7c-b2d3-442f-9e09-ebc2f691aa58	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	8	1	Green Chemistry	Environmental impact and sustainable chemistry	69	f	2026-03-15
9928c6c8-c527-40a1-9486-c8089cbdb5a0	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	9	1	Chemistry Review	Review of all chemistry topics	59	f	2026-03-22
e00d1289-ddde-4487-99a1-1edccdefb99e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	10	2	Endocrine System	Hormones, glands, and chemical regulation	53	f	2026-04-12
2bef42cf-4e42-41a0-982f-c28a9850fa19	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	11	2	Homeostasis	Maintaining stable internal environment	60	f	2026-04-19
c7fbe5c7-0d7a-402d-b9ca-f7b0b4f9b622	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	12	2	Blood Glucose Regulation	Insulin, glucagon, and diabetes	69	f	2026-04-26
6955cd38-a270-4fff-8e24-b613774b1056	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	13	2	Infectious Diseases	Pathogens and how diseases spread	46	f	2026-05-03
6049ee20-094b-4b20-85c7-965cd890e8c0	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	14	2	The Immune System	Defence mechanisms and immune response	60	f	2026-05-10
1245b78b-4804-4e03-82c7-9b197f6789bc	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	15	2	Vaccines & Immunity	How vaccines work and herd immunity	45	f	2026-05-17
8ee2274d-7aed-46bf-bae8-1e99cbc46e58	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	16	2	Term 2 Revision	Review of all biology topics	68	f	2026-05-24
d5d628b0-37a4-4138-b2e9-c69b8ca5efd4	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	science	17	2	Semester Exam Preparation	Comprehensive revision for semester exams	67	f	2026-05-31
68b38422-7076-47bc-9377-7736b85b280e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	1	1	WWI Causes & Outbreak	MAIN causes and the assassination of Franz Ferdinand	63	f	2026-01-25
20ecfc16-6400-4f62-bd53-1597da125461	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	2	1	Gallipoli & ANZAC Legend	The campaign and birth of Australian national identity	74	f	2026-02-01
ed2fe8ab-425c-4e76-aec6-b9a16130ecff	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	3	1	Western Front	Trench warfare and Australian battles in France	65	f	2026-02-08
15a419da-effb-4a1b-b12f-24095d1c561a	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	4	1	Interwar Period	Treaty of Versailles, Great Depression, rise of fascism	70	f	2026-02-15
ad89f40e-9d7e-4f06-a705-5bb5143de2fe	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	5	1	WWII Outbreak	Hitler's aggression and Australia's early involvement	66	f	2026-02-22
4aa44e7a-1587-4b13-b4f1-7985803b3dfe	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	6	1	Australian Home Front	Rationing, women's roles, and Indigenous service	49	f	2026-03-01
99d3dc02-6fea-4603-831a-f6c76ca63eca	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	7	1	The Holocaust	Persecution, genocide, and human rights	48	f	2026-03-08
c11d1a06-2687-4009-9750-2d3f00e561d9	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	8	1	Source Analysis Skills	OPCL method and evaluating historical sources	61	f	2026-03-15
8942b6e8-8bda-4cae-b186-ee0f3aa6bb2c	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	9	1	Legacy & Remembrance	ANZAC Day, Remembrance Day, and reflection	64	f	2026-03-22
48e157f7-711a-4e08-82b1-80cdf2b47324	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	10	2	Australian Democracy	Federation, Constitution, and division of powers	48	f	2026-04-12
f3838b3c-8a23-4a7e-9dd7-e8a29a47a57e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	11	2	Parliament & Law-Making	How Parliament works and laws are made	55	f	2026-04-19
28091fc5-c362-4dd3-9848-9b067f5df977	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	12	2	Political Parties & Media	Parties, interest groups, and media influence	63	f	2026-04-26
1516cacd-7e49-46aa-9693-dd5d1c527267	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	13	2	Citizenship & Rights	Citizen rights, responsibilities, and values	59	f	2026-05-03
10407207-8b90-411e-af89-180c0bc0bdbc	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	14	2	Influencing Decisions	Citizen action and global citizenship	59	f	2026-05-10
e9835318-410e-46d3-9d99-16d0b8001be6	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	15	2	International Relationships	Australia's alliances and global engagement	63	f	2026-05-17
e17a7f1c-e99a-415b-b84a-b77e7af7d924	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	16	2	Contemporary Issues	Analysing current political issues	63	f	2026-05-24
a6aaee19-d11f-4bd4-a248-831f81802e1e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	history	17	2	Semester Exam Preparation	Review and exam preparation	70	f	2026-05-31
17435ca0-7249-4b59-8d29-dd021743ea1d	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	1	1	Introduction to News Analysis	Understanding news articles and their structure	68	f	2026-01-25
0861044c-64b5-4fed-bb17-2bd249df95a3	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	2	1	Rationale & Message	Identifying purpose and main argument in news	73	f	2026-02-01
f134276a-e86d-406d-b168-123e22b1c512	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	3	1	Persuasive Techniques	Ethos, pathos, logos in news writing	52	f	2026-02-08
489aa2b1-f0bf-481a-8019-59fd340723e7	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	4	1	Visual Elements in News	Analysing headlines, images, and layout	49	f	2026-02-15
b14cdfa7-631b-4208-86ee-f6b3974c2252	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	5	1	Comparing News Coverage	How different sources cover the same story	47	f	2026-02-22
c0d1b125-bfd5-4442-aafb-5c05907e540e	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	6	1	News Analysis Assessment	Preparing for the news article analysis task	51	f	2026-03-01
4f96b8a1-6be4-451c-879f-2c1067a37394	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	7	1	Political Campaign Presentation	Creating and delivering persuasive presentations	55	f	2026-03-08
a78fe201-6190-41f7-b964-accc0b512f20	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	8	1	Presentation & Feedback	Delivering presentations and peer feedback	64	f	2026-03-15
eee70331-b823-401d-a2d8-0da186ba35df	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	9	1	Term 1 Review	Consolidating news analysis skills	54	f	2026-03-22
71b04377-a41d-4794-8075-391c4229e138	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	10	2	1984: Dystopia & Context	Introduction to Orwell and dystopian genre	51	f	2026-04-12
4900c27d-e4fe-4be8-8311-087e6e7fced4	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	11	2	1984: Oceania & the Party	The setting, Party structure, and Winston	72	f	2026-04-19
42a45730-07bb-4b8e-a99d-8214b4466d08	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	12	2	1984: Propaganda & Rebellion	Two Minutes Hate, Newspeak, and Winston's rebellion	70	f	2026-04-26
8a3e508b-a290-43b1-9f65-d53be3624702	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	13	2	1984: Love & Betrayal	Winston and Julia, O'Brien, and the Brotherhood	47	f	2026-05-03
4a2fb7d4-f9fb-4aeb-8ebf-edd6eef3dcf3	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	14	2	1984: Room 101 & Ending	Winston's defeat and the novel's conclusion	59	f	2026-05-10
58159fba-a009-4185-89f2-b4f2063b8bfb	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	15	2	Themes & Techniques	Analysing Orwell's major themes and literary techniques	47	f	2026-05-17
d7187995-1635-444b-8b8b-061a2353ce7c	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	16	2	Term 2 Revision	Review of 1984 and essay writing skills	53	f	2026-05-24
85a357a9-b9ae-496a-a69a-cb3a233654a6	2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	english	17	2	Semester Exam Preparation	Practice essays and revision strategies	46	f	2026-05-31
549877ac-e6d4-43be-8f8e-947923a4277d	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	1	1	Problem Solving & Real Numbers	Polya's problem solving steps and the real number system	50	f	2026-01-25
6f7663b6-4dd9-4bf6-89a5-f8e0e52c6926	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	2	1	Laws of Exponents	Index laws for multiplying, dividing, and raising powers	60	f	2026-02-01
5d1e1d5e-1a11-4868-814c-013b546004f1	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	3	1	Units & Measurements	Metric conversions and compound measures	46	f	2026-02-08
4b479237-ea13-496a-b0b9-1e0a7d78756d	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	4	1	Surds & Radicals	Simplifying surds and rationalising denominators	59	f	2026-02-15
5f36e818-a920-46b0-bd9e-650411a2707c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	5	1	Absolute Value	Solving absolute value equations and inequalities	50	f	2026-02-22
74e6e4b6-96f4-4894-845c-b95473c92371	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	6	1	Patterns & Generalisations	Finding patterns and writing algebraic rules	50	f	2026-03-01
23f736fc-4978-42b8-bce1-e2e1ec91b544	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	7	1	NAPLAN Preparation	Review of number, algebra, measurement, and statistics	57	f	2026-03-08
37391bd2-a19b-40bd-834e-6c8c982df2ca	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	8	1	Coordinate Geometry	Distance, midpoint, and gradient formulas	61	f	2026-03-15
7ecd87b4-eaed-457f-a416-6fd34c8d144d	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	9	1	Linear Equations & Systems	Solving linear equations and simultaneous equations	73	f	2026-03-22
020de931-597a-479e-927e-34529beb286c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	10	2	Algebra Review	Consolidating algebraic skills and techniques	46	f	2026-04-12
64b6eeab-d4e6-442f-833d-24e69489835e	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	11	2	Relations & Functions	Understanding domain, range, and function notation	72	f	2026-04-19
e009fe3e-09cb-4ed6-9d8a-addb42f06644	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	12	2	Quadratic Expressions	Expanding, factorising, and completing the square	68	f	2026-04-26
4e1e881b-e652-4666-af62-27d87c6d5468	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	13	2	Quadratic Graphs	Graphing parabolas and key features in different forms	50	f	2026-05-03
f51edf3f-8c7c-4fca-bcc1-cffa9dd254e8	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	14	2	Quadratic Equations	Solving using factorisation and the quadratic formula	63	f	2026-05-10
f204db03-fa79-4a83-935d-198cd01fbf5c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	15	2	Sequences	Arithmetic and geometric sequences	62	f	2026-05-17
8a7058f7-dc7c-41c3-8751-bd10e8f73a29	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	16	2	Formulas & Proportion	Rearranging formulas and direct/inverse proportion	64	f	2026-05-24
0ac7d57f-0189-4537-8a54-c4bc4b82b4e4	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	math	17	2	Semester Exam Preparation	Comprehensive revision for semester exams	63	f	2026-05-31
2c00bc3c-24bb-4815-90d4-59bae254d747	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	1	1	Atomic Structure	History of atomic theory and parts of the atom	49	f	2026-01-25
e751a28e-7107-4c4c-ba7a-9826fe7dec8b	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	2	1	Isotopes & Radioactivity	Isotopes, radioactive decay, and types of radiation	47	f	2026-02-01
66bf19b3-1589-48c4-a2d6-0abd155131ae	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	3	1	Half-Life & Applications	Calculating half-life and uses of radioisotopes	56	f	2026-02-08
415eed0f-0382-4264-8eb2-372c93280692	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	4	1	Atomic Model Project	Consolidating atomic structure understanding	54	f	2026-02-15
e3af2069-d20c-4772-82f1-e50e5b5ed57c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	5	1	Chemical Reactions	Signs of reactions and balancing equations	64	f	2026-02-22
392a4410-048f-406c-bf89-19f56d1b840c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	6	1	Types of Reactions	Synthesis, decomposition, combustion, neutralisation	64	f	2026-03-01
f0f6d250-0dfb-4c7a-a123-c5cca80c8c2b	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	7	1	Electrolysis	Using electricity to decompose compounds	74	f	2026-03-08
46628444-1531-49a9-8e3f-fd2fb7391423	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	8	1	Green Chemistry	Environmental impact and sustainable chemistry	54	f	2026-03-15
5f9f2ad4-3318-4fa1-91c3-292ec79939f7	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	9	1	Chemistry Review	Review of all chemistry topics	55	f	2026-03-22
64742f25-b12d-4961-bc1c-2ad83dfab639	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	10	2	Endocrine System	Hormones, glands, and chemical regulation	70	f	2026-04-12
472a34a6-9662-4474-8082-5e4b79ac37ba	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	11	2	Homeostasis	Maintaining stable internal environment	70	f	2026-04-19
603db261-ec45-4b2a-bdf2-ba6d6c5e441f	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	12	2	Blood Glucose Regulation	Insulin, glucagon, and diabetes	69	f	2026-04-26
f626915a-4294-4715-9c58-f7d46f891bd1	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	13	2	Infectious Diseases	Pathogens and how diseases spread	49	f	2026-05-03
89500347-dc51-4f51-8280-cd4a11971f21	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	14	2	The Immune System	Defence mechanisms and immune response	55	f	2026-05-10
04f7b73e-fdbf-4f86-a3b6-01b59c9ee683	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	15	2	Vaccines & Immunity	How vaccines work and herd immunity	58	f	2026-05-17
8198ec12-421f-4da8-8b5e-4ab981cf694b	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	16	2	Term 2 Revision	Review of all biology topics	49	f	2026-05-24
96bb7177-ace3-4432-88d9-661bc2d163cb	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	science	17	2	Semester Exam Preparation	Comprehensive revision for semester exams	74	f	2026-05-31
87158ba9-0598-45cb-b786-18864b828dd1	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	1	1	WWI Causes & Outbreak	MAIN causes and the assassination of Franz Ferdinand	65	f	2026-01-25
3fc77cdb-f173-4a00-96a5-ad39ae5cad75	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	2	1	Gallipoli & ANZAC Legend	The campaign and birth of Australian national identity	55	f	2026-02-01
b4ed07a1-d972-4750-b1c2-94581c49e8aa	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	3	1	Western Front	Trench warfare and Australian battles in France	56	f	2026-02-08
01e0931d-9a5a-4423-826a-5fe224305561	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	4	1	Interwar Period	Treaty of Versailles, Great Depression, rise of fascism	46	f	2026-02-15
27d33ac4-55f6-456b-a185-26ac90964dcc	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	5	1	WWII Outbreak	Hitler's aggression and Australia's early involvement	57	f	2026-02-22
2e0a9472-986d-4fce-b70c-0ff6f582a5bf	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	6	1	Australian Home Front	Rationing, women's roles, and Indigenous service	53	f	2026-03-01
3faffaec-6e7e-4953-8fe8-5aefc0caeab5	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	7	1	The Holocaust	Persecution, genocide, and human rights	60	f	2026-03-08
f03b3909-af60-49a4-a348-3bf4b7186906	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	8	1	Source Analysis Skills	OPCL method and evaluating historical sources	56	f	2026-03-15
493cca68-e366-447e-8c08-d8ce7020593a	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	9	1	Legacy & Remembrance	ANZAC Day, Remembrance Day, and reflection	52	f	2026-03-22
3aa49206-b955-47d5-a5f7-7ed1f0d714f9	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	10	2	Australian Democracy	Federation, Constitution, and division of powers	70	f	2026-04-12
d76595d3-b3fc-4805-a029-ccaed49ab524	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	11	2	Parliament & Law-Making	How Parliament works and laws are made	56	f	2026-04-19
1eea2744-566f-4a35-8c4c-e4fa4f0b3c54	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	12	2	Political Parties & Media	Parties, interest groups, and media influence	67	f	2026-04-26
6d17df49-96ba-45d4-ad44-76a2b2cea1d4	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	13	2	Citizenship & Rights	Citizen rights, responsibilities, and values	57	f	2026-05-03
a74a534a-04d7-4bd6-b768-25d75997e7c8	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	14	2	Influencing Decisions	Citizen action and global citizenship	47	f	2026-05-10
a2615996-8d51-4356-884d-01e99228e5f3	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	15	2	International Relationships	Australia's alliances and global engagement	56	f	2026-05-17
7051f91b-1553-4c68-927c-71e71225f96b	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	16	2	Contemporary Issues	Analysing current political issues	64	f	2026-05-24
bbb8b942-83fe-4789-85c4-aecdcb9b3621	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	history	17	2	Semester Exam Preparation	Review and exam preparation	51	f	2026-05-31
81af6116-bf8f-42a6-bf25-6d9404213f47	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	1	1	Introduction to News Analysis	Understanding news articles and their structure	52	f	2026-01-25
50ddc09d-374d-4539-89ff-84249c4b05e7	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	2	1	Rationale & Message	Identifying purpose and main argument in news	73	f	2026-02-01
d51f3ee1-6d36-4557-bbfc-d3551179e984	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	3	1	Persuasive Techniques	Ethos, pathos, logos in news writing	66	f	2026-02-08
3af3917f-70e7-43ed-ac43-cb9ffc56f5eb	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	4	1	Visual Elements in News	Analysing headlines, images, and layout	58	f	2026-02-15
ea7c64ad-41ca-4461-8366-a9a3a925be96	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	5	1	Comparing News Coverage	How different sources cover the same story	64	f	2026-02-22
071b4595-cc4a-4447-9852-536a42e6992f	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	6	1	News Analysis Assessment	Preparing for the news article analysis task	56	f	2026-03-01
8b9e5813-032f-4e74-948a-94c485118f9c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	7	1	Political Campaign Presentation	Creating and delivering persuasive presentations	50	f	2026-03-08
07689966-6931-4bbf-9b7c-e497dc937683	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	8	1	Presentation & Feedback	Delivering presentations and peer feedback	66	f	2026-03-15
ac9df177-2143-4fa1-b3fb-e202726b3ebb	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	9	1	Term 1 Review	Consolidating news analysis skills	45	f	2026-03-22
9c5ff51d-533a-4933-b890-0e3ccc4d4c8c	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	10	2	1984: Dystopia & Context	Introduction to Orwell and dystopian genre	47	f	2026-04-12
741b7b66-d3d5-44d3-960e-92742ba9f0a9	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	11	2	1984: Oceania & the Party	The setting, Party structure, and Winston	70	f	2026-04-19
33de2e8d-c530-4d1d-8699-b70ae91516a8	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	12	2	1984: Propaganda & Rebellion	Two Minutes Hate, Newspeak, and Winston's rebellion	51	f	2026-04-26
6f79aa58-9f66-48bd-9d3c-aa9e82b99c09	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	13	2	1984: Love & Betrayal	Winston and Julia, O'Brien, and the Brotherhood	74	f	2026-05-03
16f45e8a-6332-4bf9-89ff-2a62be828e93	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	14	2	1984: Room 101 & Ending	Winston's defeat and the novel's conclusion	62	f	2026-05-10
9622a858-278e-4830-8c5e-5984b8cf1110	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	15	2	Themes & Techniques	Analysing Orwell's major themes and literary techniques	48	f	2026-05-17
037217fb-50fa-421e-a4fa-8c0403ba80a1	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	16	2	Term 2 Revision	Review of 1984 and essay writing skills	67	f	2026-05-24
80246730-c743-4850-9f4b-5d8958ccedfa	c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	english	17	2	Semester Exam Preparation	Practice essays and revision strategies	67	f	2026-05-31
\.


--
-- Data for Name: user_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_stats (id, user_id, total_points, total_study_minutes, total_tasks_completed, total_pomodoro_sessions, level, badges_earned, daily_task_completions, task_completion_times, subject_study_minutes, last_active_date, showcased_badges) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, created_at) FROM stdin;
2511ade0-a54f-45c7-a7ca-efa8ce8a4fef	Test User	un1AOx@test.com	$2b$10$X7jIJeukuLc2hFcdCm4P5.vlOAByeetN2rrqXC5KpycIOfZATfw7m	2026-01-30 10:14:29.922005
c268e24f-d9b6-4b01-a9e3-4e8a6d5eb728	Test User	D8fSYS@test.com	$2b$10$GejvHATfDPloH85q/qoZJucl8XoKUw8lkVyhX39qcKKLBbTMm34yS	2026-01-30 10:18:56.158749
\.


--
-- Data for Name: weekly_goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.weekly_goals (id, user_id, hours) FROM stdin;
\.


--
-- Name: avatar_settings avatar_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_settings
    ADD CONSTRAINT avatar_settings_pkey PRIMARY KEY (id);


--
-- Name: avatar_settings avatar_settings_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_settings
    ADD CONSTRAINT avatar_settings_user_id_unique UNIQUE (user_id);


--
-- Name: custom_todos custom_todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_todos
    ADD CONSTRAINT custom_todos_pkey PRIMARY KEY (id);


--
-- Name: day_notes day_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day_notes
    ADD CONSTRAINT day_notes_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: streaks streaks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_pkey PRIMARY KEY (id);


--
-- Name: streaks streaks_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_user_id_unique UNIQUE (user_id);


--
-- Name: study_time study_time_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_time
    ADD CONSTRAINT study_time_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: user_stats user_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_pkey PRIMARY KEY (id);


--
-- Name: user_stats user_stats_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_unique UNIQUE (user_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weekly_goals weekly_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_goals
    ADD CONSTRAINT weekly_goals_pkey PRIMARY KEY (id);


--
-- Name: weekly_goals weekly_goals_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_goals
    ADD CONSTRAINT weekly_goals_user_id_unique UNIQUE (user_id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: avatar_settings avatar_settings_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avatar_settings
    ADD CONSTRAINT avatar_settings_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: custom_todos custom_todos_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_todos
    ADD CONSTRAINT custom_todos_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: day_notes day_notes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.day_notes
    ADD CONSTRAINT day_notes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: exams exams_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: grades grades_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: notes notes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: streaks streaks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.streaks
    ADD CONSTRAINT streaks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: study_time study_time_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.study_time
    ADD CONSTRAINT study_time_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tasks tasks_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_stats user_stats_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_stats
    ADD CONSTRAINT user_stats_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: weekly_goals weekly_goals_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.weekly_goals
    ADD CONSTRAINT weekly_goals_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 0Eo6JxjfjuBD7kOKCEEaVSLFcaveO3f3saiPCAl7xRjmH9Stl7pjrYJ53ypfqBo

