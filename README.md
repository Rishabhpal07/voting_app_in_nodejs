voting app
what?
-a functionality where user can give vote to the given candidate
-user sign in/sign up
-see the list of candidates
-user give vote only one time
-live voting count
-sign up by aadhar number
-admin for maintain and he can't able to vote
-user can change their password

----------------------------
routes:

 User Authentication:
/signup: POST - Create a new user account.
/login: POST - Log in to an existing account. [ aadhar card number + password ]

voting:
/candidates: GET - Get the list of candidates.
/vote/:candidateld: POST - Vote for a specific candidate.

vote count:
/vote/counts: GET - Get the list of candidates sorted by their vote counts.

User Profile:
/profile: GET - Get the user's profile information.
 /profile/password: PUT - Change the user's password.

Admin Candidate Management:
/candidates: POST - Create a new candidate.
/candidates/:candidateId: PUT - Update an existing candidate.
/candidates/:candidateId: DELETE - Delete a candidate from the list.