Say we write a code snippet-
int main(){
	cout<<"Hello";
} after typing the code, you click RUN
Where does your code execute?
Does your browser compile C++?
No. Browsers don't have a C++ compiler.

STEPS-
1. BROWSER-
	The browser only does three things for us.
	-Shows the UI
	-Lets you type code
	-Sends requests

	It doesn't:
	-Compile code
	-Store projects permanently
	-Authenticate users

2. FRONTEND
   we use react, typescript and tailwind css
   it shows the editor, user types the code, sends the code to the backend
   front end never directly accesses the database, it has to go through the backend

3. BACKEND
   it's the BRAIN, this is where the business logic lives.

4. DATABASE- postgresql

5. CODE EXECUTION
   say, there's an infinite loop, if our backend runs it directly, server CRASH!
   instead run in a docker container, compile, run, return output, delete container
   this container is disposable


Architecture:
1. Browser
2. Frontend
3. Backend
4. Database/Docker
5. Frontend
6. Browser