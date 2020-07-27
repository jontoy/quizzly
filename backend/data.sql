--
-- PostgreSQL database dump
--
-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout
= 0;

SET lock_timeout
= 0;

SET idle_in_transaction_session_timeout
= 0;

SET client_encoding
= 'UTF8';

SET standard_conforming_strings
= ON;

SELECT
    pg_catalog.set_config('search_path', '', FALSE);

SET check_function_bodies
= FALSE;

SET client_min_messages
= warning;

SET row_security
= OFF;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION
IF NOT EXISTS plpgsql
WITH SCHEMA pg_catalog;

CREATE EXTENSION
IF NOT EXISTS "uuid-ossp";
--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET default_tablespace
= '';

SET default_with_oids
= FALSE;

SELECT uuid_generate_v4();

CREATE TABLE public.quizzes
(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    difficulty integer NOT NULL,
    CONSTRAINT quizzes_difficulty_check CHECK (difficulty > 0
    ::integer)
);
    CREATE TABLE public.questions
    (
        question_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        quiz_id uuid NOT NULL,
        text text NOT NULL,
        order_priority double precision,
        CONSTRAINT question_quiz_id_fkey FOREIGN KEY
    (quiz_id) REFERENCES public.quizzes
    (id) ON DELETE CASCADE
    );

    CREATE TABLE public.options
    (
        option_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
        question_id uuid NOT NULL,
        value text NOT NULL,
        is_correct boolean DEFAULT FALSE NOT NULL,
        CONSTRAINT option_question_id_fkey FOREIGN KEY
    (question_id) REFERENCES public.questions
    (question_id) ON DELETE CASCADE
    );


--
-- PostgreSQL database dump complete
--
