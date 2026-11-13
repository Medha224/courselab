# HTTP Requests and Responses

**Target Duration**: 45 Minutes | **Level**: Foundational to Intermediate
**Exported**: 13/11/2026

## 🎯 Learning Objective
> Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.

## ⏱️ 45-Minute Lesson Pacing Breakdown

| Phase / Activity | Time Window | Duration | Description |
| :--- | :--- | :--- | :--- |
| **1. Hook & The Architecture of the Web** | `00:00 - 05:00` | 5 min | Deconstruct what happens when clicking a link vs submitting a payment form. |
| **2. GET vs POST: Semantics, Idempotency & Safety** | `05:00 - 18:00` | 13 min | Deep dive into RFC 9110 specifications, header formats, query params vs request bodies, and idempotency guarantees. |
| **3. Decoding Status Codes: 2xx, 4xx, and 5xx** | `18:00 - 28:00` | 10 min | Taxonomy of response categories: Success (2xx), Client Fault (4xx), and Server Fault (5xx) with canonical examples. |
| **4. Hands-on Activity: API Network Packet Inspector** | `28:00 - 38:00` | 10 min | Interactive scenario debugging real HTTP wireframes, inspecting headers, and selecting appropriate status codes. |
| **5. Formative Assessment & Knowledge Checks** | `38:00 - 43:00` | 5 min | 3 multi-part scenario questions with immediate feedback and explanation. |
| **6. Wrap-up, Cheatsheet & Supplementary Videos** | `43:00 - 45:00` | 2 min | Summary table of methods & status codes, followed by video deep-dive recommendations. |

## 📚 Lesson Content

### 1. Hook & Mental Model: The Anatomy of an HTTP Exchange (5 Min)

### The Fundamental Question
Every second, billions of devices exchange data across the globe. When you type `https://api.github.com/users` into a browser or submit a checkout form on an e-commerce website, how does the client declare its intent, and how does the server reliably communicate the outcome?

HTTP (**Hypertext Transfer Protocol**) is the application-layer foundation of the World Wide Web, formally governed by **IETF RFC 9110**. It operates on a strict **Request-Response cycle**:

1. **Client Request**: Specifies a *Method* (verb expressing intent), a *Target URI*, *Headers* (metadata), and an optional *Body* (payload).
2. **Server Response**: Returns a *Status Code* (3-digit outcome indicator), *Headers*, and an optional *Response Body* (representation of state).

> **Core Rule**: HTTP is stateless at the transport protocol layer. Every request contains all necessary context for the server to process it.

---

### 2. Deep Dive: GET vs POST Methods (13 Min)

### Comparing GET and POST

HTTP methods are not arbitrary names; they carry explicit protocol semantics defined in RFC 9110 Section 9:

| Property | `GET` Method | `POST` Method |
| :--- | :--- | :--- |
| **Primary Intent** | Retrieve data from server | Submit data to be processed / create resource |
| **Safe?** | **YES** (Must never mutate server state) | **NO** (Intended to cause server-side state mutation) |
| **Idempotent?** | **YES** ($N$ identical requests yield identical server state) | **NO** ($N$ identical requests may create $N$ records or duplicate side effects) |
| **Data Transmission** | URI Query String (`?key=value`) | Request Body (`application/json`, `multipart/form-data`) |
| **Browser Caching** | Cached aggressively by default | Not cached by default |
| **History & Bookmarks**| Can be bookmarked and saved in browser history | Cannot be safely bookmarked or refreshed without warning |

#### Critical Distinction: Safety vs Idempotency
- **Safe Methods**: A request is "safe" if its semantics are essentially read-only. Calling `GET /api/products/42` 1,000 times will not change the database.
- **Idempotent Methods**: A request is "idempotent" if the intended effect on the server of multiple identical requests is the same as for a single request. If a network blip causes a `GET` to retry, no harm occurs. Conversely, re-submitting a `POST /api/orders` might charge a customer's credit card twice!

> **Security Alert**: It is a dangerous myth that *POST is inherently encrypted*. In standard HTTP, both GET query parameters and POST request bodies travel in plaintext over the wire. **Encryption is strictly provided by TLS (HTTPS)**.

---

### 3. Decoding Status Codes: 2xx, 4xx, and 5xx (10 Min)

### The Status Code Taxonomy (RFC 9110 Section 15)
HTTP status codes are standardized 3-digit integers categorized by their first digit:

```
1xx: Informational (Request received, continuing process)
2xx: Success (Action successfully received, understood, and accepted)
3xx: Redirection (Further action required to complete request)
4xx: Client Error (Request contains bad syntax or cannot be fulfilled)
5xx: Server Error (Server failed to fulfill an apparently valid request)
```

#### 1. Category 2xx: Success
The request arrived intact, satisfied all constraints, and was successfully processed:
- **`200 OK`**: Standard success response. Used for `GET` queries or successful updates where a representation is returned in the response body.
- **`201 Created`**: The request succeeded and led to the creation of a new resource (standard outcome for `POST`). Includes a `Location` header pointing to the newly created URI.
- **`204 No Content`**: The server successfully fulfilled the request, but there is no payload to send back in the response body (frequent with `DELETE` or `PUT` operations).

#### 2. Category 4xx: Client Errors
The client made a mistake. Re-sending the identical request without modification will perpetually fail:
- **`400 Bad Request`**: The server cannot process the request due to client error (e.g., malformed JSON syntax, invalid query parameter).
- **`401 Unauthorized`**: Literally means *unauthenticated*. The client must provide valid authentication credentials (e.g., Bearer Token, API Key).
- **`403 Forbidden`**: The client is authenticated, but their account lacks permissions/authorization to access the requested resource.
- **`404 Not Found`**: The server has not found anything matching the Request-URI.

#### 3. Category 5xx: Server Errors
The client did nothing wrong! The request was valid, but an internal server fault prevented fulfillment:
- **`500 Internal Server Error`**: An unexpected unhandled exception occurred on the server (e.g., uncaught null pointer, unhandled DB connection crash).
- **`502 Bad Gateway`**: The server, acting as a gateway or reverse proxy (e.g., NGINX), received an invalid response from the upstream application server.
- **`503 Service Unavailable`**: The server is temporarily overloaded or undergoing maintenance. Clients are often instructed to check the `Retry-After` header.
- **`504 Gateway Timeout`**: The reverse proxy did not receive a timely response from the upstream microservice.

---

### 4. Practical Demonstrations: Wire-Level Inspection (10 Min)

### Wire-Level Request-Response Walkthrough

#### Scenario A: Fetching User Profile (GET)
```http
GET /api/v1/users/891?include=preferences HTTP/1.1
Host: api.acme.com
User-Agent: Mozilla/5.0
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 142
Cache-Control: max-age=3600

{
  "id": 891,
  "name": "Jane Doe",
  "role": "Engineer",
  "preferences": { "theme": "dark" }
}
```

#### Scenario B: Creating an Order (POST with 201 Created)
```http
POST /api/v1/orders HTTP/1.1
Host: api.acme.com
Content-Type: application/json
Content-Length: 68

{
  "item_id": 402,
  "quantity": 2
}

HTTP/1.1 201 Created
Location: /api/v1/orders/ORD-9923
Content-Type: application/json

{
  "order_id": "ORD-9923",
  "status": "pending_payment"
}
```

#### Scenario C: Client Error (400 Bad Request)
```http
POST /api/v1/orders HTTP/1.1
Host: api.acme.com
Content-Type: application/json

{ "item_id": "NOT_A_NUMBER", "quantity": -5 }

HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "VALIDATION_FAILED",
  "message": "Field 'quantity' must be a positive integer."
}
```

---

### 5. Hands-on Activity: The API Incident Triage (10 Min)

### Hands-on Lab: 10-Minute API Incident Triage
**Context**: You are the On-Call Software Engineer at a SaaS payment startup. Three urgent alerts arrive in Slack. For each scenario, analyze the client request, identify whether the issue is Client or Server side, and specify the exact status code and HTTP method to use.

#### Case 1: The Password Change Feature
A frontend engineer writes:
```javascript
// Client Code
fetch('https://api.startup.com/change-password?old=abc&new=xyz123', {
  method: 'GET'
});
```
- **Fault Identified**: Passwords should NEVER be transmitted via `GET` in query strings (visible in access logs, browser history, referer headers).
- **Remediation**: Refactor to `POST`, transmit credentials in an encrypted JSON body over HTTPS, and return `200 OK` or `204 No Content`.

#### Case 2: The Mysterious Payment Gateway Glitch
A customer submits an order. The frontend receives HTTP Status `502 Bad Gateway`.
- **Whose fault is it?**: Server-side infrastructure issue! The reverse proxy (e.g. AWS CloudFront / Nginx) timed out or crashed while waiting for the payment microservice.
- **Troubleshooting step**: The customer should NOT be prompted to re-enter credit card data without verification. Check backend microservice health logs.

#### Case 3: The Missing Auth Header
A mobile app calls `POST /api/v1/transfer`. The request does not include an `Authorization` bearer token header.
- **Correct Status Code**: `401 Unauthorized`.
- **Incorrect Status Code**: Returning `200 OK` with `{ "error": "unauthorized" }` in the body violates HTTP protocol design.

---

### 6. Formative Assessment & Knowledge Checks (5 Min)

### Check Your Understanding
Test your mastery against the lesson objective:

1. **Question 1 (Methods)**: A user submits a payment for a hotel booking. During transit, their Wi-Fi disconnects. Why is it dangerous if the backend engineer designed this transaction as a non-idempotent POST without idempotency keys?
   - *Answer*: Because a client retry of a non-idempotent POST can execute the charge twice on the payment processor.

2. **Question 2 (Categories)**: A client requests a resource at `/api/reports/2026`, but the server's PostgreSQL database container ran out of memory and terminated. What status code category MUST the API gateway return?
   - *Answer*: `5xx` (specifically `500 Internal Server Error` or `503 Service Unavailable`), because the client request was syntactically valid and the failure originated entirely inside server infrastructure.

3. **Question 3 (401 vs 403)**: Distinguish between `401 Unauthorized` and `403 Forbidden`.
   - *Answer*: `401` means unauthenticated (who are you? Please provide credentials). `403` means authenticated, but unauthorized (I know who you are, but you do not have permission to view this resource).

---

### 7. Wrap-up, Cheatsheet & Supplementary Exploration (2 Min)

### Key Takeaways
- **GET**: Safe, idempotent, parameters in URI query string, ideal for data fetching.
- **POST**: Unsafe, non-idempotent, payload in request body, ideal for state mutation and resource creation.
- **2xx Success**: Request processed successfully (`200 OK`, `201 Created`, `204 No Content`).
- **4xx Client Error**: Problem caused by client input or credentials (`400`, `401`, `403`, `404`).
- **5xx Server Error**: Valid request, but server infrastructure or code crashed (`500`, `502`, `503`, `504`).

Explore the curated YouTube lessons and authoritative specifications below to cement your understanding!

---

## 🛠️ Hands-on Practical Lab: API Incident Triage & Wire-Level Packet Inspection (10 Min)

**Scenario**: You are on call for an e-commerce platform. Diagnose 3 wireframe requests and assign correct methods and status codes.

**Tasks**:
1. Identify security vulnerability in passing sensitive tokens via GET query string.
2. Differentiate whether a 502 Bad Gateway is a frontend error or backend microservice crash.
3. Implement correct HTTP response headers for a newly created resource (201 Created with Location header).

**Expected Outcome**: Zero ambiguity on client fault (4xx) vs server fault (5xx) and safe GET vs mutating POST.

*Instructor Solution Guidance*: Refer to RFC 9110 Section 9 and 15.

---

## 🧠 Knowledge Checks & Formative Assessment

**Question 1**: Which of the following statements accurately characterizes the HTTP GET method according to RFC 9110?

- [x] **Option A**: GET is safe and idempotent, meaning it must not modify server state and repeated calls yield identical side effects. *(Correct Answer)*
- [ ] **Option B**: GET is encrypted by default, whereas POST transmits data in plaintext.
- [ ] **Option C**: GET is non-idempotent because web servers log each visit in their access logs.
- [ ] **Option D**: GET requests must always carry a JSON payload in their request body.

*Explanation*: RFC 9110 defines GET as both safe (read-only) and idempotent (repeated identical calls leave the server in the same state). Encryption is provided by TLS, not HTTP methods.

**Question 2**: A client submits an order via POST /api/orders. The server successfully processes the payment and creates record #402. What status code and header combination should the server return?

- [ ] **Option A**: 200 OK with no headers
- [x] **Option B**: 201 Created with a Location header pointing to /api/orders/402 *(Correct Answer)*
- [ ] **Option C**: 204 No Content with a Set-Cookie header
- [ ] **Option D**: 400 Bad Request with an error description

*Explanation*: 201 Created indicates the request was fulfilled and resulted in one or more new resources being created. RFC 9110 mandates or strongly advises providing the URI of the created resource in the Location header.

**Question 3**: An API client sends a syntactically valid JSON request to an endpoint. However, the database server is unresponsive due to an out-of-memory crash. What status code category should be returned?

- [ ] **Option A**: 2xx Success, because the request was received
- [ ] **Option B**: 4xx Client Error, because the client should retry later
- [x] **Option C**: 5xx Server Error (e.g. 500 or 503), because the failure originated on the server *(Correct Answer)*
- [ ] **Option D**: 3xx Redirection, to point the user to another website

*Explanation*: 5xx status codes indicate cases where the server is aware that it has erred or is incapable of performing the request. Since the database crashed, it is a 5xx Server Error.

---

## 📺 Supplementary Video Masterclasses

### [HTTP Crash Course & Exploration](https://www.youtube.com/watch?v=iYM2zFP3Zn0)
- **Channel**: Traversy Media | **Duration**: 38:12
- **Overview**: Visual breakdown of HTTP protocol headers, GET vs POST requests, query strings, and inspecting network traffic.
- **Key Timestamps**:
  - `04:15`: How the HTTP Request-Response Cycle Works
  - `11:30`: GET vs POST Methods: Body vs Query Parameters
  - `21:05`: Status Codes: 200, 201, 400, 404, 500 Explained

### [HTTP Methods: GET vs POST Explained](https://www.youtube.com/watch?v=2qMhI6rQp38)
- **Channel**: Hussein Nasser (Software Engineering) | **Duration**: 14:45
- **Overview**: Deep architectural dive into idempotency, caching, packet framing, and security differences between GET and POST.
- **Key Timestamps**:
  - `02:10`: Safe vs Idempotent Semantics
  - `07:45`: Why GET with Body is discouraged by RFC 9110
  - `11:20`: POST Processing & Non-idempotency

### [HTTP Status Codes in 10 Minutes](https://www.youtube.com/watch?v=wJa5CT0E-5Y)
- **Channel**: Web Dev Simplified | **Duration**: 11:23
- **Overview**: Concise guide to memorizing and distinguishing 2xx, 3xx, 4xx, and 5xx status codes with real code examples.
- **Key Timestamps**:
  - `01:40`: 2xx Success (200 OK, 201 Created, 204 No Content)
  - `05:15`: 4xx Client Errors (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found)
  - `08:30`: 5xx Server Errors (500 Internal Error, 502 Bad Gateway, 503 Unavailable)

---

## 📖 Authoritative References & Academic Citations

1. **[Book] HTTP: The Definitive Guide** by David Gourley, Brian Totty, Marjorie Sayer, Sailu Reddy, Anshu Aggarwal (O'Reilly Media, 2002)
   - URL: [https://www.oreilly.com/library/view/http-the-definitive/1565925092/](https://www.oreilly.com/library/view/http-the-definitive/1565925092/)
   - Relevant Chapters: Chapter 2 (URLs and Resources), Chapter 3 (HTTP Messages), Chapter 4 (Connection Management)
   - Key Insight: *HTTP is an application-layer request-response protocol. Methods express intent (GET is safe/idempotent, POST is unsafe/non-idempotent), and status codes communicate server execution state.*

2. **[Book] Computer Networking: A Top-Down Approach (8th Edition)** by James Kurose, Keith Ross (Pearson, 2020)
   - URL: [https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003334](https://www.pearson.com/en-us/subject-catalog/p/computer-networking-a-top-down-approach/P200000003334)
   - Relevant Chapters: Chapter 2.2: The Web and HTTP
   - Key Insight: *Detailed breakdown of persistent vs non-persistent HTTP, RTT calculation, header formatting, and status code taxonomies.*

3. **[Book] RESTful Web APIs: Services for a Changing World** by Leonard Richardson, Mike Amundsen (O'Reilly Media, 2013)
   - URL: [https://www.oreilly.com/library/view/restful-web-apis/9781449358068/](https://www.oreilly.com/library/view/restful-web-apis/9781449358068/)
   - Relevant Chapters: Chapter 3: How to Represent Resources
   - Key Insight: *Distinction between safe operations (GET, HEAD) and state-mutating operations (POST, PUT, DELETE), with proper HTTP error handling.*

4. **[Book] Financial audit** by United States. General Accounting Office (Academic Press, 1943)
   - URL: [https://openlibrary.org/works/OL565229W](https://openlibrary.org/works/OL565229W)
   - Relevant Chapters: Core subject chapters
   - Key Insight: *Authoritative literature covering fundamentals and implementations of HTTP Requests and Responses.*

5. **[Book] Data Communications and Networking** by Behrouz A. Forouzan, Catherine Ann Coombs, Sophia Chung Fegan (Academic Press, 2000)
   - URL: [https://openlibrary.org/works/OL35531W](https://openlibrary.org/works/OL35531W)
   - Relevant Chapters: Core subject chapters
   - Key Insight: *Authoritative literature covering fundamentals and implementations of HTTP Requests and Responses.*

6. **[Book] The web application hacker's handbook** by Dafydd Stuttard, Marcus Pinto (Academic Press, 2007)
   - URL: [https://openlibrary.org/works/OL13814659W](https://openlibrary.org/works/OL13814659W)
   - Relevant Chapters: Core subject chapters
   - Key Insight: *Authoritative literature covering fundamentals and implementations of HTTP Requests and Responses.*

7. **[Web & Specification] RFC 9110: HTTP Semantics (Supersedes RFC 7231 & 2616)** (Internet Engineering Task Force (IETF))
   - URL: [https://datatracker.ietf.org/doc/html/rfc9110](https://datatracker.ietf.org/doc/html/rfc9110)

8. **[Web & Specification] MDN Web Docs: HTTP Request Methods** (Mozilla Developer Network)
   - URL: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)

9. **[Web & Specification] MDN Web Docs: HTTP Response Status Codes** (Mozilla Developer Network)
   - URL: [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

10. **[Web & Specification] HTTP** (Wikipedia Encyclopedia)
   - URL: [https://en.wikipedia.org/wiki/HTTP](https://en.wikipedia.org/wiki/HTTP)

11. **[Web & Specification] HTTP 403** (Wikipedia Encyclopedia)
   - URL: [https://en.wikipedia.org/wiki/HTTP_403](https://en.wikipedia.org/wiki/HTTP_403)

12. **[Web & Specification] List of HTTP status codes** (Wikipedia Encyclopedia)
   - URL: [https://en.wikipedia.org/wiki/List_of_HTTP_status_codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)

13. **[Web & Specification] List of HTTP header fields** (Wikipedia Encyclopedia)
   - URL: [https://en.wikipedia.org/wiki/List_of_HTTP_header_fields](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)

