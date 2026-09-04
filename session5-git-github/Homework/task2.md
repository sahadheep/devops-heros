Task 2 - Git Cherry-Pick

Objective
To understand how git cherry-pick is used to apply a specific commit from one branch to another branch.

Step 1: Create Commits on Main
echo "Commit 1 - Git cherry-pick practice" >> app.txt
git add app.txt
git commit -m "Add commit 1"

echo "Commit 2 - Main branch change" >> app.txt
git add app.txt
git commit -m "Add commit 2"

echo "Commit 3 - Main branch change" >> app.txt
git add app.txt
git commit -m "Add commit 3"

i used log -oneline to check the commits

Step 2: Create a New Branch
I created a new branch named cherry-pick-practice.
git checkout -b cherry-pick-practice

Step 3: Create Commits on the New Branch
echo "Feature branch change 1" >> app.txt
git add app.txt
git commit -m "Add feature branch change 1"

echo "Feature branch change 2" >> app.txt
git add app.txt
git commit -m "Add feature branch change 2"

echo "Feature branch change 3" >> app.txt
git add app.txt
git commit -m "Add feature branch change 3"

git checkout main

git cherry-pick <commit-hash>

Step 5: Verification

git log --oneline -8
cat app.txt

What I Understood

git cherry-pick is used when we want to take one specific commit from another branch and apply it to the current branch. It is different from merging because it does not bring all the changes from the other branch.

Conclusion

I practiced creating commits on different branches, identifying a particular commit using git log, and applying that commit to the main branch using git cherry-pick.

