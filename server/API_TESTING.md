# AcademicHub - API Testing Guide

This guide provides the complete REST API documentation for AcademicHub, detailing the endpoints, required roles, headers, and sample request/response JSON payloads.

---

## Table of Contents
1. [General Setup & Headers](#general-setup--headers)
2. [Authentication Endpoints](#1-authentication-endpoints)
3. [Department Endpoints](#2-department-endpoints)
4. [Subject Endpoints](#3-subject-endpoints)
5. [Class Endpoints](#4-class-endpoints)
6. [Teacher Endpoints](#5-teacher-endpoints)
7. [Student Endpoints](#6-student-endpoints)
8. [Analytics Endpoints](#7-analytics-endpoints)

---

## General Setup & Headers

For endpoints requiring authentication, Better-Auth relies on cookie-based session tracking. In client tools like Postman, Bruno, or Insomnia:
1. Ensure **Cookie sharing/jar** is enabled.
2. Sign-in requests will automatically set the authentication cookie (`better-auth.session_token`).
3. Subsequent requests will send this cookie automatically.

If manually passing headers:
* `Content-Type: application/json`
* `Cookie: better-auth.session_token=<your_session_token>`

---

## 1. Authentication Endpoints
These endpoints are handled by **Better-Auth** under `/api/auth/*`.

### SignUp (Create Admin/Teacher/Student)
* **Method**: `POST`
* **URL**: `/api/auth/sign-up/email`
* **Access**: Public / Anyone
* **Request Body**:
  ```json
  {
    "email": "admin@university.edu",
    "password": "Password123",
    "name": "Super Admin",
    "role": "admin"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "user": {
      "id": "usr_abc123",
      "email": "admin@university.edu",
      "name": "Super Admin",
      "emailVerified": false,
      "role": "admin",
      "createdAt": "2026-06-16T15:00:00.000Z",
      "updatedAt": "2026-06-16T15:00:00.000Z"
    },
    "session": {
      "id": "sess_xyz789",
      "token": "tok_123456",
      "expiresAt": "2026-07-16T15:00:00.000Z",
      "userId": "usr_abc123"
    }
  }
  ```

### SignIn
* **Method**: `POST`
* **URL**: `/api/auth/sign-in/email`
* **Access**: Public
* **Request Body**:
  ```json
  {
    "email": "admin@university.edu",
    "password": "Password123"
  }
  ```
* **Response (200 OK)**:
  *Sets cookie: `better-auth.session_token`*
  ```json
  {
    "user": {
      "id": "usr_abc123",
      "email": "admin@university.edu",
      "name": "Super Admin",
      "role": "admin"
    },
    "session": {
      "id": "sess_xyz789",
      "token": "tok_123456"
    }
  }
  ```

### SignOut
* **Method**: `POST`
* **URL**: `/api/auth/sign-out`
* **Access**: Authenticated
* **Response (200 OK)**:
  ```json
  {
    "success": true
  }
  ```

---

## 2. Department Endpoints
Organizational branches for subjects and faculty.

### Get Departments (List)
* **Method**: `GET`
* **URL**: `/api/departments?page=1&limit=10&search=Computer`
* **Access**: `admin` | `teacher` | `student`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": 1,
          "code": "CS",
          "name": "Computer Science",
          "description": "Department of Computer Science & Engineering",
          "createdAt": "2026-06-16T15:00:00.000Z",
          "updatedAt": "2026-06-16T15:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    },
    "error": null
  }
  ```

### Get Department By ID
* **Method**: `GET`
* **URL**: `/api/departments/1`
* **Access**: `admin` | `teacher` | `student`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "code": "CS",
      "name": "Computer Science",
      "description": "Department of Computer Science & Engineering",
      "subjects": [
        { "id": 5, "name": "Algorithms", "code": "CS101" }
      ]
    },
    "error": null
  }
  ```

### Create Department
* **Method**: `POST`
* **URL**: `/api/departments`
* **Access**: `admin` only
* **Request Body**:
  ```json
  {
    "code": "EE",
    "name": "Electrical Engineering",
    "description": "Department of Electrical Engineering"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "code": "EE",
      "name": "Electrical Engineering",
      "description": "Department of Electrical Engineering",
      "createdAt": "2026-06-16T15:00:00.000Z",
      "updatedAt": "2026-06-16T15:00:00.000Z"
    },
    "error": null
  }
  ```

### Update Department
* **Method**: `PUT`
* **URL**: `/api/departments/2`
* **Access**: `admin` only
* **Request Body**:
  ```json
  {
    "name": "Electrical & Electronics Engineering"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2,
      "code": "EE",
      "name": "Electrical & Electronics Engineering",
      "description": "Department of Electrical Engineering"
    },
    "error": null
  }
  ```

### Delete Department
* **Method**: `DELETE`
* **URL**: `/api/departments/2`
* **Access**: `admin` only
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": null,
    "error": null
  }
  ```

---

## 3. Subject Endpoints
Curriculum subjects grouped by department.

### Get Subjects (List)
* **Method**: `GET`
* **URL**: `/api/subjects?page=1&limit=10&search=Algorithms`
* **Access**: `admin` | `teacher` | `student`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": 5,
          "department_id": 1,
          "code": "CS101",
          "name": "Algorithms",
          "description": "Design and analysis of computer algorithms"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    },
    "error": null
  }
  ```

### Create Subject
* **Method**: `POST`
* **URL**: `/api/subjects`
* **Access**: `admin` only
* **Request Body**:
  ```json
  {
    "department_id": 1,
    "code": "CS102",
    "name": "Data Structures",
    "description": "Basic and advanced data structures"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 6,
      "department_id": 1,
      "code": "CS102",
      "name": "Data Structures",
      "description": "Basic and advanced data structures"
    },
    "error": null
  }
  ```

---

## 4. Class Endpoints
Enrollable classroom courses.

### Get Classes (List)
* **Method**: `GET`
* **URL**: `/api/classes?page=1&limit=10`
* **Access**: `admin` | `teacher` | `student` (Students only see classes they joined)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": 3,
          "subjectId": 5,
          "teacherId": "usr_teach1",
          "name": "Section A",
          "joinCode": "X8K2PA",
          "capacity": 30,
          "schedule": "Mon 10:00 - 12:00",
          "status": "active",
          "subject": { "name": "Algorithms" },
          "teacher": { "name": "Dr. Alan Turing" }
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 1,
        "totalPages": 1
      }
    },
    "error": null
  }
  ```

### Create Class
* **Method**: `POST`
* **URL**: `/api/classes`
* **Access**: `admin` only
* **Request Body**:
  ```json
  {
    "subjectId": 5,
    "teacherId": "usr_teach1",
    "name": "Section B",
    "capacity": 25,
    "schedule": "Wed 14:00 - 16:00"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "subjectId": 5,
      "teacherId": "usr_teach1",
      "name": "Section B",
      "joinCode": "Z89PQA2",
      "capacity": 25,
      "schedule": "Wed 14:00 - 16:00",
      "status": "active"
    },
    "error": null
  }
  ```

### Update Class
* **Method**: `PUT`
* **URL**: `/api/classes/4`
* **Access**: `admin` or the assigned `teacher`
* **Request Body**:
  ```json
  {
    "schedule": "Fri 09:00 - 11:00",
    "capacity": 30
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 4,
      "schedule": "Fri 09:00 - 11:00",
      "capacity": 30
    },
    "error": null
  }
  ```

### Student Join Class
* **Method**: `POST`
* **URL**: `/api/classes/join`
* **Access**: `student` only
* **Request Body**:
  ```json
  {
    "joinCode": "X8K2PA"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "enrollment": {
        "id": 12,
        "classId": 3,
        "studentId": "usr_stud77",
        "createdAt": "2026-06-16T15:00:00.000Z"
      },
      "class": {
        "id": 3,
        "name": "Section A"
      }
    },
    "error": null
  }
  ```

---

## 5. Teacher Endpoints

### Get Teachers (List)
* **Method**: `GET`
* **URL**: `/api/teachers?page=1&limit=10`
* **Access**: `admin` | `teacher` | `student`
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": "usr_teach1",
          "name": "Dr. Alan Turing",
          "email": "turing@university.edu",
          "departmentId": 1,
          "department": { "name": "Computer Science" }
        }
      ],
      "pagination": { "page": 1, "total": 1 }
    },
    "error": null
  }
  ```

### Create Teacher Profile
* **Method**: `POST`
* **URL**: `/api/teachers`
* **Access**: `admin` only
* **Request Body**:
  ```json
  {
    "name": "Grace Hopper",
    "email": "hopper@university.edu",
    "password": "Password777",
    "departmentId": 1
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_teach2",
      "name": "Grace Hopper",
      "email": "hopper@university.edu",
      "role": "teacher"
    },
    "error": null
  }
  ```

---

## 6. Student Endpoints

### Get Students (List)
* **Method**: `GET`
* **URL**: `/api/students`
* **Access**: `admin` | `teacher` only
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": "usr_stud77",
          "name": "Ada Lovelace",
          "email": "ada@university.edu",
          "departmentId": 1,
          "department": { "name": "Computer Science" }
        }
      ]
    },
    "error": null
  }
  ```

### Update Student Profile
* **Method**: `PUT`
* **URL**: `/api/students/usr_stud77`
* **Access**: `admin` or the `student` themselves
* **Request Body**:
  ```json
  {
    "name": "Ada Lovelace Byron"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "usr_stud77",
      "name": "Ada Lovelace Byron"
    },
    "error": null
  }
  ```

---

## 7. Analytics Endpoints

### Admin Dashboard Analytics
* **Method**: `GET`
* **URL**: `/api/analytics/admin`
* **Access**: `admin` only
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "counts": {
        "departments": 5,
        "subjects": 22,
        "teachers": 14,
        "students": 142,
        "activeClasses": 8
      },
      "departmentEnrollment": [
        { "name": "Computer Science", "students": 68 },
        { "name": "Electrical Engineering", "students": 42 }
      ],
      "teacherWorkload": [
        { "name": "Dr. Alan Turing", "classesCount": 3 },
        { "name": "Grace Hopper", "classesCount": 2 }
      ]
    },
    "error": null
  }
  ```

### Teacher Dashboard Analytics
* **Method**: `GET`
* **URL**: `/api/analytics/teacher`
* **Access**: `teacher` only
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "counts": {
        "classesTaught": 3,
        "uniqueStudents": 48
      },
      "classRosterDetails": [
        { "className": "Section A", "enrolled": 18, "capacity": 30 }
      ],
      "timetable": [
        {
          "classId": 3,
          "className": "Section A",
          "schedule": "Mon 10:00 - 12:00",
          "subjectName": "Algorithms",
          "status": "active"
        }
      ]
    },
    "error": null
  }
  ```

### Student Dashboard Analytics
* **Method**: `GET`
* **URL**: `/api/analytics/student`
* **Access**: `student` only
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "counts": {
        "classesJoined": 2
      },
      "timetable": [
        {
          "classId": 3,
          "className": "Section A",
          "schedule": "Mon 10:00 - 12:00",
          "subjectName": "Algorithms",
          "teacherName": "Dr. Alan Turing"
        }
      ]
    },
    "error": null
  }
  ```

---
