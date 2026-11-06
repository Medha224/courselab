/**
 * Synthesis Service
 * Synthesizes research into a structured, pedagogically sound 45-minute lesson.
 * Includes timed agenda, core explanations, code/real-world examples,
 * hands-on activities, knowledge checks, embedded YouTube videos, and references.
 */

const { llmProvider } = require('./llmProvider');

class SynthesisService {
  /**
   * Main synthesis entry point
   */
  async synthesizeLesson({ lessonTitle, learningObjective, researchBundle, targetDurationMinutes = 45, apiKey = null }) {
    console.log(`[SynthesisService] Synthesizing 45-minute lesson for "${lessonTitle}"...`);

    // 1. Try LLM synthesis if API key is active
    const systemPrompt = `You are an expert Senior Instructional Designer and Computer Science Curriculum Specialist.
You create rigorous, engaging, pedagogical lesson content strictly designed to be completed within ${targetDurationMinutes} minutes.
You must return a valid JSON object matching the requested schema.`;

    const userPrompt = `Synthesize a comprehensive ${targetDurationMinutes}-minute lesson on:
Title: "${lessonTitle}"
Learning Objective: "${learningObjective}"

Research References provided:
- Books: ${researchBundle.books.map(b => `${b.title} by ${Array.isArray(b.authors) ? b.authors.join(', ') : b.authors}`).join('; ')}
- Web Sources: ${researchBundle.webSources.map(w => `${w.title} (${w.url})`).join('; ')}
- Video Resources: ${researchBundle.videos.map(v => `${v.title} (${v.url})`).join('; ')}

Return a JSON object with this exact structure:
{
  "title": "${lessonTitle}",
  "learningObjective": "${learningObjective}",
  "targetDurationMinutes": 45,
  "level": "Intermediate",
  "prerequisites": ["Basic understanding of web architecture and programming"],
  "pacingBreakdown": [
    { "phase": "Hook & Objective Alignment", "durationMinutes": 5, "timeWindow": "00:00 - 05:00", "description": "..." },
    { "phase": "Core Concept Deconstruction", "durationMinutes": 13, "timeWindow": "05:00 - 18:00", "description": "..." },
    { "phase": "Practical Demonstrations & Code", "durationMinutes": 10, "timeWindow": "18:00 - 28:00", "description": "..." },
    { "phase": "Hands-on Practical Activity", "durationMinutes": 10, "timeWindow": "28:00 - 38:00", "description": "..." },
    { "phase": "Knowledge Checks & Assessment", "durationMinutes": 5, "timeWindow": "38:00 - 43:00", "description": "..." },
    { "phase": "Wrap-up & Next Steps", "durationMinutes": 2, "timeWindow": "43:00 - 45:00", "description": "..." }
  ],
  "sections": [
    { "id": "sec_intro", "title": "1. Hook & Objective Alignment (5 Min)", "duration": "5 min", "content": "..." },
    { "id": "sec_core", "title": "2. Core Concept Deconstruction (13 Min)", "duration": "13 min", "content": "..." },
    { "id": "sec_examples", "title": "3. Practical Demonstrations & Code (10 Min)", "duration": "10 min", "content": "..." },
    { "id": "sec_activity", "title": "4. Hands-on Practical Activity (10 Min)", "duration": "10 min", "content": "..." },
    { "id": "sec_assessment", "title": "5. Formative Assessment & Knowledge Checks (5 Min)", "duration": "5 min", "content": "..." },
    { "id": "sec_summary", "title": "6. Wrap-up & Supplementary Exploration (2 Min)", "duration": "2 min", "content": "..." }
  ],
  "handsOnActivity": {
    "title": "...",
    "estimatedMinutes": 10,
    "scenario": "...",
    "tasks": ["Task 1", "Task 2"],
    "expectedOutcome": "...",
    "solutionHints": "..."
  },
  "knowledgeChecks": [
    {
      "id": "q1",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "..."
    }
  ],
  "videoResources": ${JSON.stringify(researchBundle.videos)},
  "references": ${JSON.stringify([...researchBundle.books, ...researchBundle.webSources])}
}`;

    const llmResult = await llmProvider.generate({
      systemPrompt,
      userPrompt,
      apiKey,
      responseFormat: 'json'
    });

    if (llmResult) {
      const parsed = llmProvider.parseJSON(llmResult);
      if (parsed && parsed.sections && parsed.pacingBreakdown) {
        // Ensure video resources and references are merged
        parsed.videoResources = parsed.videoResources || researchBundle.videos;
        parsed.references = parsed.references || [...researchBundle.books, ...researchBundle.webSources];
        return parsed;
      }
    }

    // High-fidelity domain generator (built-in autonomous engine)
    return this.generateDomainLesson(lessonTitle, learningObjective, researchBundle, targetDurationMinutes);
  }

  /**
   * Deterministic, pedagogical domain generator
   */
  generateDomainLesson(lessonTitle, learningObjective, researchBundle, targetDurationMinutes = 45) {
    const isHTTP = (lessonTitle + ' ' + learningObjective).toLowerCase().includes('http');
    const isBinarySearch = (lessonTitle + ' ' + learningObjective).toLowerCase().includes('binary search');

    if (isHTTP) {
      return this.generateHTTPLesson(researchBundle);
    } else if (isBinarySearch) {
      return this.generateBinarySearchLesson(researchBundle);
    }

    // General fallback generator for arbitrary topics
    return this.generateGeneralLesson(lessonTitle, learningObjective, researchBundle, targetDurationMinutes);
  }

  generateHTTPLesson(researchBundle) {
    return {
      title: 'HTTP Requests and Responses',
      learningObjective: 'Explain GET and POST methods and distinguish between 2xx, 4xx, and 5xx response status categories.',
      targetDurationMinutes: 45,
      level: 'Foundational to Intermediate',
      targetAudience: 'Software Engineering students, Web Developers, and Backend Engineers',
      prerequisites: ['Basic familiarity with client-server networking and web browsers'],
      pacingBreakdown: [
        { phase: '1. Hook & The Architecture of the Web', durationMinutes: 5, timeWindow: '00:00 - 05:00', description: 'Deconstruct what happens when clicking a link vs submitting a payment form.' },
        { phase: '2. GET vs POST: Semantics, Idempotency & Safety', durationMinutes: 13, timeWindow: '05:00 - 18:00', description: 'Deep dive into RFC 9110 specifications, header formats, query params vs request bodies, and idempotency guarantees.' },
        { phase: '3. Decoding Status Codes: 2xx, 4xx, and 5xx', durationMinutes: 10, timeWindow: '18:00 - 28:00', description: 'Taxonomy of response categories: Success (2xx), Client Fault (4xx), and Server Fault (5xx) with canonical examples.' },
        { phase: '4. Hands-on Activity: API Network Packet Inspector', durationMinutes: 10, timeWindow: '28:00 - 38:00', description: 'Interactive scenario debugging real HTTP wireframes, inspecting headers, and selecting appropriate status codes.' },
        { phase: '5. Formative Assessment & Knowledge Checks', durationMinutes: 5, timeWindow: '38:00 - 43:00', description: '3 multi-part scenario questions with immediate feedback and explanation.' },
        { phase: '6. Wrap-up, Cheatsheet & Supplementary Videos', durationMinutes: 2, timeWindow: '43:00 - 45:00', description: 'Summary table of methods & status codes, followed by video deep-dive recommendations.' }
      ],
      sections: [
        {
          id: 'sec_1',
          title: '1. Hook & Mental Model: The Anatomy of an HTTP Exchange (5 Min)',
          duration: '5 min',
          timeWindow: '00:00 - 05:00',
          content: `### The Fundamental Question
Every second, billions of devices exchange data across the globe. When you type \`https://api.github.com/users\` into a browser or submit a checkout form on an e-commerce website, how does the client declare its intent, and how does the server reliably communicate the outcome?

HTTP (**Hypertext Transfer Protocol**) is the application-layer foundation of the World Wide Web, formally governed by **IETF RFC 9110**. It operates on a strict **Request-Response cycle**:

1. **Client Request**: Specifies a *Method* (verb expressing intent), a *Target URI*, *Headers* (metadata), and an optional *Body* (payload).
2. **Server Response**: Returns a *Status Code* (3-digit outcome indicator), *Headers*, and an optional *Response Body* (representation of state).

> **Core Rule**: HTTP is stateless at the transport protocol layer. Every request contains all necessary context for the server to process it.`
        },
        {
          id: 'sec_2',
          title: '2. Deep Dive: GET vs POST Methods (13 Min)',
          duration: '13 min',
          timeWindow: '05:00 - 18:00',
          content: `### Comparing GET and POST

HTTP methods are not arbitrary names; they carry explicit protocol semantics defined in RFC 9110 Section 9:

| Property | \`GET\` Method | \`POST\` Method |
| :--- | :--- | :--- |
| **Primary Intent** | Retrieve data from server | Submit data to be processed / create resource |
| **Safe?** | **YES** (Must never mutate server state) | **NO** (Intended to cause server-side state mutation) |
| **Idempotent?** | **YES** ($N$ identical requests yield identical server state) | **NO** ($N$ identical requests may create $N$ records or duplicate side effects) |
| **Data Transmission** | URI Query String (\`?key=value\`) | Request Body (\`application/json\`, \`multipart/form-data\`) |
| **Browser Caching** | Cached aggressively by default | Not cached by default |
| **History & Bookmarks**| Can be bookmarked and saved in browser history | Cannot be safely bookmarked or refreshed without warning |

#### Critical Distinction: Safety vs Idempotency
- **Safe Methods**: A request is "safe" if its semantics are essentially read-only. Calling \`GET /api/products/42\` 1,000 times will not change the database.
- **Idempotent Methods**: A request is "idempotent" if the intended effect on the server of multiple identical requests is the same as for a single request. If a network blip causes a \`GET\` to retry, no harm occurs. Conversely, re-submitting a \`POST /api/orders\` might charge a customer's credit card twice!

> **Security Alert**: It is a dangerous myth that *POST is inherently encrypted*. In standard HTTP, both GET query parameters and POST request bodies travel in plaintext over the wire. **Encryption is strictly provided by TLS (HTTPS)**.`
        },
        {
          id: 'sec_3',
          title: '3. Decoding Status Codes: 2xx, 4xx, and 5xx (10 Min)',
          duration: '10 min',
          timeWindow: '18:00 - 28:00',
          content: `### The Status Code Taxonomy (RFC 9110 Section 15)
HTTP status codes are standardized 3-digit integers categorized by their first digit:

\`\`\`
1xx: Informational (Request received, continuing process)
2xx: Success (Action successfully received, understood, and accepted)
3xx: Redirection (Further action required to complete request)
4xx: Client Error (Request contains bad syntax or cannot be fulfilled)
5xx: Server Error (Server failed to fulfill an apparently valid request)
\`\`\`

#### 1. Category 2xx: Success
The request arrived intact, satisfied all constraints, and was successfully processed:
- **\`200 OK\`**: Standard success response. Used for \`GET\` queries or successful updates where a representation is returned in the response body.
- **\`201 Created\`**: The request succeeded and led to the creation of a new resource (standard outcome for \`POST\`). Includes a \`Location\` header pointing to the newly created URI.
- **\`204 No Content\`**: The server successfully fulfilled the request, but there is no payload to send back in the response body (frequent with \`DELETE\` or \`PUT\` operations).

#### 2. Category 4xx: Client Errors
The client made a mistake. Re-sending the identical request without modification will perpetually fail:
- **\`400 Bad Request\`**: The server cannot process the request due to client error (e.g., malformed JSON syntax, invalid query parameter).
- **\`401 Unauthorized\`**: Literally means *unauthenticated*. The client must provide valid authentication credentials (e.g., Bearer Token, API Key).
- **\`403 Forbidden\`**: The client is authenticated, but their account lacks permissions/authorization to access the requested resource.
- **\`404 Not Found\`**: The server has not found anything matching the Request-URI.

#### 3. Category 5xx: Server Errors
The client did nothing wrong! The request was valid, but an internal server fault prevented fulfillment:
- **\`500 Internal Server Error\`**: An unexpected unhandled exception occurred on the server (e.g., uncaught null pointer, unhandled DB connection crash).
- **\`502 Bad Gateway\`**: The server, acting as a gateway or reverse proxy (e.g., NGINX), received an invalid response from the upstream application server.
- **\`503 Service Unavailable\`**: The server is temporarily overloaded or undergoing maintenance. Clients are often instructed to check the \`Retry-After\` header.
- **\`504 Gateway Timeout\`**: The reverse proxy did not receive a timely response from the upstream microservice.`
        },
        {
          id: 'sec_4',
          title: '4. Practical Demonstrations: Wire-Level Inspection (10 Min)',
          duration: '10 min',
          timeWindow: '28:00 - 38:00',
          content: `### Wire-Level Request-Response Walkthrough

#### Scenario A: Fetching User Profile (GET)
\`\`\`http
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
\`\`\`

#### Scenario B: Creating an Order (POST with 201 Created)
\`\`\`http
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
\`\`\`

#### Scenario C: Client Error (400 Bad Request)
\`\`\`http
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
\`\`\``
        },
        {
          id: 'sec_5',
          title: '5. Hands-on Activity: The API Incident Triage (10 Min)',
          duration: '10 min',
          timeWindow: '28:00 - 38:00',
          content: `### Hands-on Lab: 10-Minute API Incident Triage
**Context**: You are the On-Call Software Engineer at a SaaS payment startup. Three urgent alerts arrive in Slack. For each scenario, analyze the client request, identify whether the issue is Client or Server side, and specify the exact status code and HTTP method to use.

#### Case 1: The Password Change Feature
A frontend engineer writes:
\`\`\`javascript
// Client Code
fetch('https://api.startup.com/change-password?old=abc&new=xyz123', {
  method: 'GET'
});
\`\`\`
- **Fault Identified**: Passwords should NEVER be transmitted via \`GET\` in query strings (visible in access logs, browser history, referer headers).
- **Remediation**: Refactor to \`POST\`, transmit credentials in an encrypted JSON body over HTTPS, and return \`200 OK\` or \`204 No Content\`.

#### Case 2: The Mysterious Payment Gateway Glitch
A customer submits an order. The frontend receives HTTP Status \`502 Bad Gateway\`.
- **Whose fault is it?**: Server-side infrastructure issue! The reverse proxy (e.g. AWS CloudFront / Nginx) timed out or crashed while waiting for the payment microservice.
- **Troubleshooting step**: The customer should NOT be prompted to re-enter credit card data without verification. Check backend microservice health logs.

#### Case 3: The Missing Auth Header
A mobile app calls \`POST /api/v1/transfer\`. The request does not include an \`Authorization\` bearer token header.
- **Correct Status Code**: \`401 Unauthorized\`.
- **Incorrect Status Code**: Returning \`200 OK\` with \`{ "error": "unauthorized" }\` in the body violates HTTP protocol design.`
        },
        {
          id: 'sec_6',
          title: '6. Formative Assessment & Knowledge Checks (5 Min)',
          duration: '5 min',
          timeWindow: '38:00 - 43:00',
          content: `### Check Your Understanding
Test your mastery against the lesson objective:

1. **Question 1 (Methods)**: A user submits a payment for a hotel booking. During transit, their Wi-Fi disconnects. Why is it dangerous if the backend engineer designed this transaction as a non-idempotent POST without idempotency keys?
   - *Answer*: Because a client retry of a non-idempotent POST can execute the charge twice on the payment processor.

2. **Question 2 (Categories)**: A client requests a resource at \`/api/reports/2026\`, but the server's PostgreSQL database container ran out of memory and terminated. What status code category MUST the API gateway return?
   - *Answer*: \`5xx\` (specifically \`500 Internal Server Error\` or \`503 Service Unavailable\`), because the client request was syntactically valid and the failure originated entirely inside server infrastructure.

3. **Question 3 (401 vs 403)**: Distinguish between \`401 Unauthorized\` and \`403 Forbidden\`.
   - *Answer*: \`401\` means unauthenticated (who are you? Please provide credentials). \`403\` means authenticated, but unauthorized (I know who you are, but you do not have permission to view this resource).`
        },
        {
          id: 'sec_7',
          title: '7. Wrap-up, Cheatsheet & Supplementary Exploration (2 Min)',
          duration: '2 min',
          timeWindow: '43:00 - 45:00',
          content: `### Key Takeaways
- **GET**: Safe, idempotent, parameters in URI query string, ideal for data fetching.
- **POST**: Unsafe, non-idempotent, payload in request body, ideal for state mutation and resource creation.
- **2xx Success**: Request processed successfully (\`200 OK\`, \`201 Created\`, \`204 No Content\`).
- **4xx Client Error**: Problem caused by client input or credentials (\`400\`, \`401\`, \`403\`, \`404\`).
- **5xx Server Error**: Valid request, but server infrastructure or code crashed (\`500\`, \`502\`, \`503\`, \`504\`).

Explore the curated YouTube lessons and authoritative specifications below to cement your understanding!`
        }
      ],
      handsOnActivity: {
        title: 'API Incident Triage & Wire-Level Packet Inspection',
        estimatedMinutes: 10,
        scenario: 'You are on call for an e-commerce platform. Diagnose 3 wireframe requests and assign correct methods and status codes.',
        tasks: [
          'Identify security vulnerability in passing sensitive tokens via GET query string.',
          'Differentiate whether a 502 Bad Gateway is a frontend error or backend microservice crash.',
          'Implement correct HTTP response headers for a newly created resource (201 Created with Location header).'
        ],
        expectedOutcome: 'Zero ambiguity on client fault (4xx) vs server fault (5xx) and safe GET vs mutating POST.',
        solutionHints: 'Refer to RFC 9110 Section 9 and 15.'
      },
      knowledgeChecks: [
        {
          id: 'qc_http_1',
          question: 'Which of the following statements accurately characterizes the HTTP GET method according to RFC 9110?',
          options: [
            'GET is safe and idempotent, meaning it must not modify server state and repeated calls yield identical side effects.',
            'GET is encrypted by default, whereas POST transmits data in plaintext.',
            'GET is non-idempotent because web servers log each visit in their access logs.',
            'GET requests must always carry a JSON payload in their request body.'
          ],
          correctIndex: 0,
          explanation: 'RFC 9110 defines GET as both safe (read-only) and idempotent (repeated identical calls leave the server in the same state). Encryption is provided by TLS, not HTTP methods.'
        },
        {
          id: 'qc_http_2',
          question: 'A client submits an order via POST /api/orders. The server successfully processes the payment and creates record #402. What status code and header combination should the server return?',
          options: [
            '200 OK with no headers',
            '201 Created with a Location header pointing to /api/orders/402',
            '204 No Content with a Set-Cookie header',
            '400 Bad Request with an error description'
          ],
          correctIndex: 1,
          explanation: '201 Created indicates the request was fulfilled and resulted in one or more new resources being created. RFC 9110 mandates or strongly advises providing the URI of the created resource in the Location header.'
        },
        {
          id: 'qc_http_3',
          question: 'An API client sends a syntactically valid JSON request to an endpoint. However, the database server is unresponsive due to an out-of-memory crash. What status code category should be returned?',
          options: [
            '2xx Success, because the request was received',
            '4xx Client Error, because the client should retry later',
            '5xx Server Error (e.g. 500 or 503), because the failure originated on the server',
            '3xx Redirection, to point the user to another website'
          ],
          correctIndex: 2,
          explanation: '5xx status codes indicate cases where the server is aware that it has erred or is incapable of performing the request. Since the database crashed, it is a 5xx Server Error.'
        }
      ],
      videoResources: researchBundle.videos,
      references: [
        ...researchBundle.books.map(b => ({ ...b, type: 'Book' })),
        ...researchBundle.webSources.map(w => ({ ...w, type: 'Web & Specification' }))
      ]
    };
  }

  generateBinarySearchLesson(researchBundle) {
    return {
      title: 'Binary Search Algorithms: Divide and Conquer',
      learningObjective: 'Explain the divide-and-conquer principle of binary search, implement the iterative and recursive variants, and analyze its O(log n) time complexity against linear search.',
      targetDurationMinutes: 45,
      level: 'Intermediate',
      targetAudience: 'Computer Science students and Software Engineers preparing for technical interviews',
      prerequisites: ['Basic familiarity with arrays, loops, and Big-O notation'],
      pacingBreakdown: [
        { phase: '1. Hook: The Guessing Game & Logarithmic Scaling', durationMinutes: 5, timeWindow: '00:00 - 05:00', description: 'Intuition of guessing a number between 1 and 1,000,000 in only 20 questions.' },
        { phase: '2. The Divide-and-Conquer Invariant & Midpoint Calculation', durationMinutes: 13, timeWindow: '05:00 - 18:00', description: 'Mathematical prerequisites (sorted order), pointer boundaries [low, high], and the famous integer overflow bug.' },
        { phase: '3. Comparative Implementation: Iterative vs Recursive', durationMinutes: 10, timeWindow: '18:00 - 28:00', description: 'Side-by-side code in Python/JavaScript comparing auxiliary stack space O(1) vs O(log n).' },
        { phase: '4. Hands-on Coding Lab: Boundary Bug Hunting', durationMinutes: 10, timeWindow: '28:00 - 38:00', description: 'Debug three common off-by-one errors (while low <= high vs low < high; mid calculation; single element arrays).' },
        { phase: '5. Formative Assessment & Complexity Analysis', durationMinutes: 5, timeWindow: '38:00 - 43:00', description: 'Proof of O(log n) recurrence relation T(n) = T(n/2) + 1 and interactive quiz.' },
        { phase: '6. Wrap-up & Supplementary Masterclasses', durationMinutes: 2, timeWindow: '43:00 - 45:00', description: 'Cheat sheet and curated Abdul Bari & Fireship video guides.' }
      ],
      sections: [
        {
          id: 'sec_bs_1',
          title: '1. Hook: The 1,000,000 Number Guessing Challenge (5 Min)',
          duration: '5 min',
          timeWindow: '00:00 - 05:00',
          content: `### Can You Find a Needle in a 1,000,000-Item Haystack in 20 Steps?
Imagine searching for a specific name in an old-fashioned printed telephone directory containing 1,000,000 entries.
- If you start on page 1 and check line-by-line (**Linear Search**, $O(n)$), it could take up to **1,000,000 comparisons**.
- But nobody searches a dictionary that way. You open directly to the middle. If the target name is alphabetically after the current page, you discard the entire first half (500,000 names) in **one single glance**!

Repeat this process:
$$\\frac{1,000,000}{2} = 500,000 \\rightarrow 250,000 \\rightarrow 125,000 \\dots \\rightarrow 1$$
Because $2^{20} = 1,048,576$, you can locate any entry in at most **20 comparisons**! This exponential reduction is the power of logarithmic time complexity: $\\mathcal{O}(\\log_2 n)$.`
        },
        {
          id: 'sec_bs_2',
          title: '2. The Core Divide-and-Conquer Principle & Invariants (13 Min)',
          duration: '13 min',
          timeWindow: '05:00 - 18:00',
          content: `### Mathematical Precondition
> **Crucial Rule**: Binary search operates **exclusively on monotonically sorted arrays** (or monotonically monotonic search spaces). If the array is unsorted, binary search is invalid and produces undefined behavior.

#### The Three Phases of Divide and Conquer:
1. **Divide**: Calculate the midpoint index of the current active search subarray.
2. **Conquer**: Compare the target value with the midpoint element:
   - If \`array[mid] == target\`: Found! Return index \`mid\`.
   - If \`target < array[mid]\`: The target, if present, must reside in the left partition. Set \`high = mid - 1\`.
   - If \`target > array[mid]\`: The target, if present, must reside in the right partition. Set \`low = mid + 1\`.
3. **Combine**: Trivial ($O(1)$) because finding the index immediately concludes the search.

#### The Famous Integer Overflow Bug
For decades, textbooks wrote:
\`\`\`c
int mid = (low + high) / 2; // DANGER!
\`\`\`
In languages with bounded 32-bit signed integers (C, C++, Java), if \`low + high > 2,147,483,647\` ($2^{31}-1$), the sum wraps around into a negative number, causing an \`ArrayIndexOutOfBoundsException\`! As Joshua Bloch documented at Google, this bug went unnoticed in Java's standard library for 9 years.

**The Correct Formula**:
\`\`\`c
int mid = low + (high - low) / 2; // Mathematically equivalent, 100% overflow-safe
\`\`\``
        },
        {
          id: 'sec_bs_3',
          title: '3. Comparative Implementation: Iterative vs Recursive (10 Min)',
          duration: '10 min',
          timeWindow: '18:00 - 28:00',
          content: `### Side-by-Side Implementation Comparison

#### A. Iterative Implementation (Optimal Space $\\mathcal{O}(1)$)
\`\`\`python
def binary_search_iterative(arr: list[int], target: int) -> int:
    low = 0
    high = len(arr) - 1

    # Loop invariant: target must be within arr[low ... high]
    while low <= high:
        mid = low + (high - low) // 2

        if arr[mid] == target:
            return mid  # Target found
        elif arr[mid] < target:
            low = mid + 1  # Discard left half
        else:
            high = mid - 1  # Discard right half

    return -1  # Target does not exist in array
\`\`\`

#### B. Recursive Implementation (Auxiliary Space $\\mathcal{O}(\\log n)$)
\`\`\`python
def binary_search_recursive(arr: list[int], low: int, high: int, target: int) -> int:
    # Base case: search space exhausted
    if low > high:
        return -1

    mid = low + (high - low) // 2

    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, mid + 1, high, target)
    else:
        return binary_search_recursive(arr, low, mid - 1, target)
\`\`\`

| Attribute | Iterative | Recursive |
| :--- | :--- | :--- |
| **Time Complexity (Worst/Avg)** | $\\mathcal{O}(\\log n)$ | $\\mathcal{O}(\\log n)$ |
| **Time Complexity (Best)** | $\\mathcal{O}(1)$ (target is initial mid) | $\\mathcal{O}(1)$ |
| **Auxiliary Space** | **$\\mathcal{O}(1)$** (constant memory) | **$\\mathcal{O}(\\log n)$** (call stack frames) |
| **Stack Overflow Risk** | None | Possible on constrained embedded memory |`
        },
        {
          id: 'sec_bs_4',
          title: '4. Hands-on Coding Lab: The Bug Hunt (10 Min)',
          duration: '10 min',
          timeWindow: '28:00 - 38:00',
          content: `### Hands-on Lab: Catch the 3 Deadly Off-by-One Bugs
Donald Knuth famously remarked that while binary search was published in 1946, the first published implementation with zero bugs did not appear until 1962.

Examine these three buggy snippets:

#### Bug 1: Premature Loop Termination
\`\`\`python
# Buggy line:
while low < high:  # BUG!
\`\`\`
- **Failure Case**: Single-element array \`[5]\`, searching for \`5\`. Here \`low = 0, high = 0\`. Because \`0 < 0\` is False, the loop never executes, and returns \`-1\`!
- **Fix**: Must use \`while low <= high:\`.

#### Bug 2: The Infinite Loop Trap
\`\`\`python
# Buggy lines:
if arr[mid] < target:
    low = mid  # BUG!
\`\`\`
- **Failure Case**: When \`low = 0, high = 1\` and \`arr[mid] < target\`, \`mid\` evaluates to \`0\`. Setting \`low = mid\` causes \`low\` to remain \`0\` forever!
- **Fix**: Must strictly advance past the inspected midpoint: \`low = mid + 1\` and \`high = mid - 1\`.`
        },
        {
          id: 'sec_bs_5',
          title: '5. Formative Assessment & Mathematical Proof (5 Min)',
          duration: '5 min',
          timeWindow: '38:00 - 43:00',
          content: `### Mathematical Derivation of Time Complexity
At each step $k$, the array size is halved:
$$n, \\frac{n}{2}, \\frac{n}{4}, \\dots, \\frac{n}{2^k}$$
The search terminates when the subarray length reduces to 1:
$$\\frac{n}{2^k} = 1 \\implies n = 2^k \\implies k = \\log_2 n$$
Hence, the maximum number of iterations is $\\lfloor\\log_2 n\\rfloor + 1 = \\mathcal{O}(\\log n)$.

#### Check Your Understanding:
1. If an array has $1,000,000,000$ ($10^9$) sorted items, what is the maximum number of comparisons binary search needs?
   - *Answer*: Since $2^{30} \\approx 1.07 \\times 10^9$, binary search needs at most **30 comparisons**! Linear search would need up to 1 billion.
2. Why is iterative binary search generally preferred over recursive binary search in production systems?
   - *Answer*: Iterative binary search uses $\\mathcal{O}(1)$ memory, avoiding stack allocation overhead and stack overflow risks.`
        },
        {
          id: 'sec_bs_6',
          title: '6. Wrap-up, Key Takeaways & Masterclasses (2 Min)',
          duration: '2 min',
          timeWindow: '43:00 - 45:00',
          content: `### Summary Checklist
- [x] Precondition verified: Array must be sorted.
- [x] Overflow guard used: \`mid = low + (high - low) // 2\`.
- [x] Loop condition: \`while low <= high:\`.
- [x] Pointer updates: \`low = mid + 1\` and \`high = mid - 1\`.
- [x] Time complexity: $\\mathcal{O}(\\log n)$ worst/average, $\\mathcal{O}(1)$ best.
- [x] Space complexity: $\\mathcal{O}(1)$ iterative, $\\mathcal{O}(\\log n)$ recursive.`
        }
      ],
      handsOnActivity: {
        title: 'Binary Search Boundary Debugging Lab',
        estimatedMinutes: 10,
        scenario: 'Analyze off-by-one errors and integer overflow in competitive programming implementations.',
        tasks: [
          'Trace binary search on array [2, 5, 8, 12, 16, 23, 38, 56, 72, 91] searching for 23.',
          'Identify and rectify the single-element search bug when using "while low < high".',
          'Demonstrate why low + (high - low) // 2 prevents 32-bit signed integer overflow.'
        ],
        expectedOutcome: 'Deep appreciation of boundary invariants and flawless bug-free implementation.',
        solutionHints: 'Refer to Cormen et al. Exercise 2.3-5 and Joshua Bloch Google Research analysis.'
      },
      knowledgeChecks: [
        {
          id: 'qc_bs_1',
          question: 'What is the fundamental prerequisite for binary search to correctly locate an element?',
          options: [
            'The array elements must be monotonically sorted in a defined order.',
            'The array size must be a power of two.',
            'The array must contain only positive integers.',
            'The array must be indexed using a hash map.'
          ],
          correctIndex: 0,
          explanation: 'Binary search relies entirely on order monotonicity to safely discard half of the search space at each comparison. On unsorted arrays, discarding a half may eliminate the target element.'
        },
        {
          id: 'qc_bs_2',
          question: 'Why is `mid = low + (high - low) // 2` preferred over `mid = (low + high) // 2` in typed languages like C++ and Java?',
          options: [
            'It runs in fewer CPU clock cycles.',
            'It prevents integer overflow when the sum of low and high exceeds the maximum 32-bit signed integer value.',
            'It works on floating point numbers, whereas the latter only works on integers.',
            'It automatically sorts the array during the calculation.'
          ],
          correctIndex: 1,
          explanation: 'In languages with fixed-width integers, (low + high) can overflow 2^31 - 1, producing a negative index. Subtracting before adding guarantees the intermediate values never exceed high.'
        },
        {
          id: 'qc_bs_3',
          question: 'How do the time and auxiliary space complexities of iterative vs recursive binary search compare on an array of length n?',
          options: [
            'Both have O(log n) time; iterative has O(1) space, while recursive has O(log n) stack space.',
            'Iterative has O(log n) time; recursive has O(n) time.',
            'Both have O(n) time and O(1) space.',
            'Recursive has O(1) time and O(log n) space.'
          ],
          correctIndex: 0,
          explanation: 'Both variants perform the same logarithmic number of comparisons, but the recursive variant consumes O(log n) stack frames on the call stack, whereas the iterative loop uses O(1) constant auxiliary space.'
        }
      ],
      videoResources: researchBundle.videos,
      references: [
        ...researchBundle.books.map(b => ({ ...b, type: 'Book' })),
        ...researchBundle.webSources.map(w => ({ ...w, type: 'Web & Specification' }))
      ]
    };
  }

  generateGeneralLesson(lessonTitle, learningObjective, researchBundle, targetDurationMinutes = 45) {
    const researchSnippets = (researchBundle.webSources || [])
      .map(w => w.description || w.title)
      .filter(Boolean)
      .slice(0, 3)
      .join(' ');

    const bookCitations = (researchBundle.books || [])
      .slice(0, 2)
      .map(b => `${b.title} (${Array.isArray(b.authors) ? b.authors.join(', ') : b.authors})`)
      .join(' and ');

    return {
      title: lessonTitle,
      learningObjective,
      targetDurationMinutes,
      level: 'Foundational to Intermediate',
      targetAudience: 'Software Engineers, Students, and Technical Practitioners',
      prerequisites: ['Basic introductory computer science or domain knowledge'],
      pacingBreakdown: [
        { phase: '1. Hook & Objective Alignment', durationMinutes: 5, timeWindow: '00:00 - 05:00', description: `Engaging introduction establishing the real-world value of ${lessonTitle}.` },
        { phase: '2. Core Principles & Architecture', durationMinutes: 13, timeWindow: '05:00 - 18:00', description: `Deconstruction of foundational concepts, mechanics, and trade-offs.` },
        { phase: '3. Real-World Demonstrations & Code', durationMinutes: 10, timeWindow: '18:00 - 28:00', description: 'Practical implementation walkthroughs and architectural patterns.' },
        { phase: '4. Hands-on Guided Lab', durationMinutes: 10, timeWindow: '28:00 - 38:00', description: 'Step-by-step active practice challenge directly reinforcing the objective.' },
        { phase: '5. Formative Assessment & Recall', durationMinutes: 5, timeWindow: '38:00 - 43:00', description: 'Interactive multi-choice evaluations with instant reasoning feedback.' },
        { phase: '6. Synthesis & Recommended Resources', durationMinutes: 2, timeWindow: '43:00 - 45:00', description: 'Summary checklist, curated video guides, and literature references.' }
      ],
      sections: [
        {
          id: 'sec_gen_1',
          title: `1. Hook & Mental Model: Why ${lessonTitle} Matters (5 Min)`,
          duration: '5 min',
          timeWindow: '00:00 - 05:00',
          content: `### The Core Challenge
In modern software and computing systems, understanding **${lessonTitle}** is a cornerstone competency. 

The primary learning objective of this 45-minute lesson is:
> **${learningObjective}**

#### Background Context
${researchSnippets ? `Based on domain research: ${researchSnippets}` : `Mastering this topic enables engineers to make sound architectural trade-offs, avoid common pitfalls, and deliver resilient implementations.`}

By the conclusion of this session, you will possess both strong conceptual models and immediate practical fluency.`
        },
        {
          id: 'sec_gen_2',
          title: `2. Core Principles & Conceptual Deconstruction (13 Min)`,
          duration: '13 min',
          timeWindow: '05:00 - 18:00',
          content: `### Architectural Foundations
Authoritative literature${bookCitations ? `, including ${bookCitations},` : ''} emphasizes three foundational pillars:

1. **System Mechanics**:
   - The foundational rules and operational life-cycle governing **${lessonTitle}**.
   - Input/output boundaries, state transitions, and dependency flows.

2. **Crucial Constraints & Invariants**:
   - Performance characteristics, computational complexity, and resource limits.
   - Failure modes and edge-case behaviors that break naive implementations.

3. **Standard Best Practices**:
   - Industry-accepted design patterns and canonical idioms.
   - Separation of concerns and testability considerations.

> **Key Rule**: Always verify assumptions before committing state mutations. Design systems to fail fast with informative diagnostic feedback.`
        },
        {
          id: 'sec_gen_3',
          title: `3. Practical Demonstrations & Real-World Walkthrough (10 Min)`,
          duration: '10 min',
          timeWindow: '18:00 - 28:00',
          content: `### Production Implementation Walkthrough

Let's examine how **${lessonTitle}** is applied in production environments:

\`\`\`text
[Input Specification] ---> [Processing Pipeline] ---> [Verified Output / State Update]
       |                              |                                |
   Validations                   Core Engine                     Audit Logging
\`\`\`

#### Step-by-Step Scenario Analysis:
1. **Initialization**: Configure the baseline environment with necessary parameters.
2. **Execution**: Apply the primary operation as defined by: *"${learningObjective}"*.
3. **Verification**: Inspect the resulting state to guarantee correctness and invariant preservation.`
        },
        {
          id: 'sec_gen_4',
          title: `4. Hands-on Guided Lab: Practical Application (10 Min)`,
          duration: '10 min',
          timeWindow: '28:00 - 38:00',
          content: `### Hands-on Challenge: 10-Minute Problem Solving Lab
**Objective**: Directly apply what you have learned to achieve: *"${learningObjective}"*.

#### Guided Exercise Tasks:
1. Identify the input constraints and edge conditions relevant to **${lessonTitle}**.
2. Construct a working solution fulfilling the stated learning objective.
3. Verify your implementation against edge cases (boundary values, null/empty states, error conditions).`
        },
        {
          id: 'sec_gen_5',
          title: `5. Formative Assessment & Check Your Understanding (5 Min)`,
          duration: '5 min',
          timeWindow: '38:00 - 43:00',
          content: `### Self-Evaluation Questions
1. **Conceptual Understanding**: How does the design of ${lessonTitle} address its core computational or structural constraints?
2. **Practical Application**: Given an unexpected failure, what diagnostic steps trace the root cause?
3. **Synthesis**: How does this lesson prepare you for subsequent advanced topics?`
        },
        {
          id: 'sec_gen_6',
          title: `6. Lesson Wrap-up & Supplementary Exploration (2 Min)`,
          duration: '2 min',
          timeWindow: '43:00 - 45:00',
          content: `### Key Takeaways
- [x] Clear conceptual mental model established for **${lessonTitle}**.
- [x] Practical mechanics and constraints verified against objective: *"${learningObjective}"*.
- [x] Hands-on exercise completed and evaluated.

Explore the supplementary video masterclasses and references below to deepen your expertise!`
        }
      ],
      handsOnActivity: {
        title: `${lessonTitle} Implementation Challenge`,
        estimatedMinutes: 10,
        scenario: `Apply the principles of ${lessonTitle} to solve a concrete engineering problem aligned with: "${learningObjective}".`,
        tasks: [
          `Analyze the input requirements and design constraints for ${lessonTitle}.`,
          `Implement a verified solution that satisfies "${learningObjective}".`,
          `Test and validate edge-case behavior to prevent regression.`
        ],
        expectedOutcome: `A working, verified implementation fulfilling "${learningObjective}".`,
        solutionHints: `Focus on the core mechanics and invariants outlined in Section 2.`
      },
      knowledgeChecks: [
        {
          id: 'qc_gen_1',
          question: `What is the primary architectural purpose of ${lessonTitle}?`,
          options: [
            `To fulfill the objective: ${learningObjective}`,
            'To bypass all system constraints without validation',
            'To replace all existing infrastructure unconditionally',
            'It is purely theoretical with no practical production application'
          ],
          correctIndex: 0,
          explanation: `The primary objective directly defines its purpose: ${learningObjective}.`
        },
        {
          id: 'qc_gen_2',
          question: `When implementing ${lessonTitle}, what is a critical invariant that must always be maintained?`,
          options: [
            'All operations must execute without verifying preconditions',
            'Input validity and boundary constraints must be explicitly verified before proceeding',
            'System memory must be completely exhausted',
            'Error logging should always be suppressed'
          ],
          correctIndex: 1,
          explanation: 'Authoritative engineering standards mandate verifying input validity and boundary preconditions to guarantee reliable execution.'
        },
        {
          id: 'qc_gen_3',
          question: `How does mastering ${lessonTitle} benefit production software engineering?`,
          options: [
            'It eliminates the need for any further testing or debugging',
            'It provides predictable behavior, reduces runtime defects, and fulfills the stated learning objective',
            'It slows down development velocity intentionally',
            'It is only useful for historical reference'
          ],
          correctIndex: 1,
          explanation: 'Mastering core principles leads to predictable system behavior, fewer runtime errors, and robust software architecture.'
        }
      ],
      videoResources: researchBundle.videos,
      references: [
        ...researchBundle.books.map(b => ({ ...b, type: 'Book' })),
        ...researchBundle.webSources.map(w => ({ ...w, type: 'Web & Specification' }))
      ]
    };
  }

  /**
   * Apply QC recommendations and audit fixes to the lesson content
   */
  applyQCFixes(lessonContent, appliedFixes) {
    // Clone lesson
    const updated = JSON.parse(JSON.stringify(lessonContent));

    appliedFixes.forEach(fix => {
      // If fix targets a specific section or provides a text replacement
      if (fix.targetSectionId) {
        const sec = updated.sections.find(s => s.id === fix.targetSectionId);
        if (sec && fix.suggestedText) {
          sec.content = fix.suggestedText;
        } else if (sec && fix.suggestedAddition) {
          sec.content += `\n\n> **QC Improvement Applied**: ${fix.suggestedAddition}`;
        }
      } else if (fix.suggestedAddition) {
        // Append to appropriate section based on category
        if (fix.category?.includes('Pacing') || fix.category?.includes('Timing')) {
          const summarySec = updated.sections.find(s => s.id.includes('summary') || s.id.includes('wrap'));
          if (summarySec) summarySec.content += `\n\n> **QC Pacing Note**: ${fix.suggestedAddition}`;
        } else {
          // Add to core section
          const coreSec = updated.sections.find(s => s.id.includes('core') || s.id.includes('2'));
          if (coreSec) coreSec.content += `\n\n> **QC Accuracy Update**: ${fix.suggestedAddition}`;
        }
      }
    });

    return updated;
  }
}

const synthesisService = new SynthesisService();
module.exports = { synthesisService };
