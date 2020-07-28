--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.options (
    option_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    question_id uuid NOT NULL,
    value text NOT NULL,
    is_correct boolean DEFAULT false NOT NULL
);


--
-- Name: questions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.questions (
    question_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quiz_id uuid NOT NULL,
    text text NOT NULL,
    order_priority double precision
);


--
-- Name: quizzes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.quizzes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    difficulty integer NOT NULL,
    CONSTRAINT quizzes_difficulty_check CHECK ((difficulty > 0))
);


--
-- Data for Name: options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.options (option_id, question_id, value, is_correct) FROM stdin;
0f9d9945-9e41-48be-9276-a2c0c575bf01	09047907-2843-4882-a889-8917152e9884	6	t
6ac46234-7de8-44b4-b10f-4486804a862e	09047907-2843-4882-a889-8917152e9884	7	f
a10ad540-a522-4f23-9257-ca3746f074da	09047907-2843-4882-a889-8917152e9884	8	f
94488a9c-c649-4163-a948-73fdd28f53f1	ebd32b73-e4c1-427e-a77f-0e94132b85da	true	f
a2893637-f17c-479e-a73f-5b25d6a48694	ebd32b73-e4c1-427e-a77f-0e94132b85da	false	t
75efc419-a81e-4cd4-ba99-91fbc1aec2f7	49702c82-95a1-481f-915b-9aa5a3949f1b	1	f
9f7bda50-2671-4fed-8fa3-9c1fdefaac72	49702c82-95a1-481f-915b-9aa5a3949f1b	2	t
580a6386-ac72-4d6e-94ca-bc6e85da6d6e	49702c82-95a1-481f-915b-9aa5a3949f1b	3	f
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.questions (question_id, quiz_id, text, order_priority) FROM stdin;
09047907-2843-4882-a889-8917152e9884	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	How many is six?	1
ebd32b73-e4c1-427e-a77f-0e94132b85da	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	Is 7 > 8?	2
49702c82-95a1-481f-915b-9aa5a3949f1b	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	How many digits are in 10	3
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quizzes (id, name, difficulty) FROM stdin;
f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	Super awesome quiz1	4
da81fa30-ac15-43e5-9eac-476aac5fc406	Super awesome quiz2	5
d2847ab4-3148-4cdc-b578-afef14e3f4b0	Super awesome quiz3	1
\.


--
-- Name: options options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT options_pkey PRIMARY KEY (option_id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);


--
-- Name: quizzes quizzes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.quizzes
    ADD CONSTRAINT quizzes_pkey PRIMARY KEY (id);


--
-- Name: options option_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.options
    ADD CONSTRAINT option_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(question_id) ON DELETE CASCADE;


--
-- Name: questions question_quiz_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT question_quiz_id_fkey FOREIGN KEY (quiz_id) REFERENCES public.quizzes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

