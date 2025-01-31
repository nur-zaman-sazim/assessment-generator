export const getPrompt = (
  businessTheme: string,
  frontend: string,
  backend: string,
  database: string,
  uiFramework: string,
  formLibrary: string
) => {
  return `
You are an expert in designing technical assessments for full-stack software engineers. Your goal is to generate new coding challenges that assess a candidate's ability to design, develop, and document a web application. The challenges should be similar in complexity and scope to the provided example assessments, meaning:

**Difficulty Level:** Medium to High. The candidate should be proficient in multiple technologies, be able to make architectural decisions, and translate requirements into a working application. It should go beyond simple coding exercises and require practical software development.

**Structure:** The challenges should follow a four-part structure:

*   **Part 1: Preliminary Features:** Basic user authentication (login and registration), with a simple implementation (e.g., string matching, no need for robust security at this stage).
*   **Part 2: Core Data Management:** Focus on CRUD operations for a central data entity, including a multi-step form for adding the entity, filtering, pagination, and clear data modeling with categories/genres/types.
    *   The UI should be relatively simple but must enforce the functionalities.
*   **Part 3: Resource Interaction/User Workflow:** This part focuses on how users interact with the data from Part 2. This *could* be a traditional transaction, but it should be more generally defined as a way users can *engage with* or *manage* the entities. Examples include:
    *   **Assignments/Allocations:** Assigning resources to users, tracking who has access.
    *   **Reservations/Scheduling:** Booking or reserving an item or a time slot.
    *   **Collaboration/Sharing:**  Sharing resources with other users or groups, granting permissions.
    *   **Status Changes/Workflow:** Managing the lifecycle or status of an entity (e.g., pending, approved, completed, archived).
    *   **Review/Rating/Commenting:** Users provide feedback or interact with the entity via some form of interaction.
    *   The main point is it needs to implement a "next level" of functionality besides simple CRUD operations and requires a state change logic.
*   **Part 4: Implementation Documentation (MANDATORY):** Technical documentation explaining architectural choices, corner cases, problem-solving approach, and design decisions.

**Key Characteristics of Generated Challenges:**

*   **Full-Stack Nature:** Require the creation of a front-end, back-end, and database.
*   **Technology Stack:** Imply the use of:
    *   Frontend: ${frontend}.
    *   Backend: ${backend}.
    *   Database: ${database}.
    *   UI: ${uiFramework}
    *   Forms: ${formLibrary}
*   **Open-Ended Considerations:** Should implicitly require the candidate to think about aspects like:
    *   Testing
    *   User experience and input validation
    *   Component architecture and reusability
    *   Database modeling
    *   Readability and software best practices
    *   Handling practical and error cases

**Generation Instructions:**

1.  **Theme Variety:** Generate challenges with different themes that allow for a variety of ways for users to interact with data (e.g., project management, asset tracking, content management, learning platform, etc.). Avoid repeating themes.
2.  **Clear Requirements:** Ensure the challenge has clear, specific requirements for each part.
3.  **Generalized Logic:** The core interaction logic in Part 3 should be focused on resource management or a workflow, and not limited to buy/sell/rent. The logic needs to handle a status change on the data entity and ideally should have some edge cases.
4.  **Avoid Overcomplexity:** Ensure that, while challenging, the problem can be reasonably completed in a typical technical assessment timeframe.
5.  **Provide Specific Example:** Include a short text with an example for the data modeling part, you instuct to include the "Categories" or "Genres" concept.
6.  **Emphasis:** Clearly state the importance of technical documentation (Part 4).

**Output Format:**

The output should be structured like a technical assessment, including an Introduction, Parts 1-4 as described above, Tips for the Candidate, Submission Guidelines, and Assessment Evaluation Points.

**Example (use this as a guide, not literally copy):**

**Title:** Project Task Management System

**Introduction:** Create an application where users can create, assign, and track tasks.

**Part 1:** Preliminary features (login, registration)...

**Part 2:** As a user you can ... add, edit, delete tasks, filter by project, status (e.g., To-Do, In-Progress, Completed) with pagination.
* The data model will have the concept of task categories (e.g., Feature, Bug, Documentation).

**Part 3:** Ability to assign tasks to users, display all the tasks assigned to users, change task status (e.g., To-Do, In-Progress, Completed), show task history.
...

**Part 4:** Technical documentation...

**Tips, Submission Guidelines, Evaluation,** ...

**Now generate one such challenge. With the theme ${businessTheme}** 
  `;
};
