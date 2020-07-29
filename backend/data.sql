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
23b0a410-f210-4966-b85d-ae9a1dd367b1	369ddd93-7dfc-4d27-823c-b9610c0df4ab	Potato	t
6280dcce-1c60-4be3-af8b-3f1c7729b07d	369ddd93-7dfc-4d27-823c-b9610c0df4ab	Carrot	f
07b3fd58-1a03-46b6-8052-11a4ebb08440	369ddd93-7dfc-4d27-823c-b9610c0df4ab	Radish	f
91be0c65-b75b-41a1-b626-7dcebb5eba7c	369ddd93-7dfc-4d27-823c-b9610c0df4ab	Cucumber	f
77bd6642-2d09-42e7-adab-0d94243bf9fa	efeef59a-b332-45d6-af4d-434c00df4bed	Mega Millionaire	f
130487ed-aa4d-4c26-8b65-44c14bf158ff	efeef59a-b332-45d6-af4d-434c00df4bed	Gigillionaire	f
7bc02876-5d62-4f9a-8c17-3a3a5d9ac8fd	efeef59a-b332-45d6-af4d-434c00df4bed	1000-Millionaire	f
8bd9d71b-ffcf-4cad-a2b0-76525046ba84	efeef59a-b332-45d6-af4d-434c00df4bed	Billionaire	t
c874a02b-bd83-40e2-9163-1d12a343c2fe	7455220c-aa92-4027-8b61-8a2b00bace5b	Ireland	f
b5d8f110-6e9b-4397-8b58-ff0c0b8f3502	7455220c-aa92-4027-8b61-8a2b00bace5b	Italy	f
22a7f00c-8718-4d98-8595-6f8ef992cf7f	7455220c-aa92-4027-8b61-8a2b00bace5b	Iraq	t
2fbe8203-ad84-49ed-b536-96641abc8e9a	7455220c-aa92-4027-8b61-8a2b00bace5b	Iran	f
d8a050eb-2b4b-4e7f-86f3-02c716d04cad	8df40fef-cb78-4ba9-8df2-b15dcc897524	The Hound of the Baskervilles	f
f946e974-d705-4dec-8c7a-67fb3a1f09f1	8df40fef-cb78-4ba9-8df2-b15dcc897524	The Sign of the Four	f
f2b9417b-64dd-45b0-ba09-ec91fc48738e	8df40fef-cb78-4ba9-8df2-b15dcc897524	The Valley of Fear	f
d3887a8b-51fb-4d18-8f03-56d277a1d52a	8df40fef-cb78-4ba9-8df2-b15dcc897524	A Study in Scarlet	t
\.


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.questions (question_id, quiz_id, text, order_priority) FROM stdin;
09047907-2843-4882-a889-8917152e9884	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	How many is six?	1
ebd32b73-e4c1-427e-a77f-0e94132b85da	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	Is 7 > 8?	2
49702c82-95a1-481f-915b-9aa5a3949f1b	f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	How many digits are in 10	3
369ddd93-7dfc-4d27-823c-b9610c0df4ab	e4e9ac7a-3700-42b6-8205-dfd21f019a50	The failure of which crop caused famine in Ireland in 1845?	1
efeef59a-b332-45d6-af4d-434c00df4bed	e4e9ac7a-3700-42b6-8205-dfd21f019a50	What is the term for a person with assets of over 1,000 million dollars?	2
7455220c-aa92-4027-8b61-8a2b00bace5b	e4e9ac7a-3700-42b6-8205-dfd21f019a50	Operation Desert Shield was the code name of the build-up to action in what country?	3
8df40fef-cb78-4ba9-8df2-b15dcc897524	e4e9ac7a-3700-42b6-8205-dfd21f019a50	Which was the first Sherlock Holmes story written by Sir Arthur Conan Doyle?	4
\.


--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.quizzes (id, name, difficulty) FROM stdin;
f1846cdc-43a6-47ad-bc5c-4fcc3498a1df	Super awesome quiz1	4
da81fa30-ac15-43e5-9eac-476aac5fc406	Super awesome quiz2	5
d2847ab4-3148-4cdc-b578-afef14e3f4b0	Super awesome quiz3	1
e4e9ac7a-3700-42b6-8205-dfd21f019a50	Obscure Pub Facts Part 1	10
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

