
import { getMembers } from "../members/firebaseMemberFunctions";
import { Member } from "../members/Member";

// export interface Member {
//   id: string;
//   name: string;
//   joined: Semester;
//   gender: "Male" | "Female" | "Non-binary" | "Other";
//   grade: "Freshman" | "Sophomore" | "Junior" | "Senior" | "Super Senior";
//   forest:
//     | "Lost in the Woods"
//     | "Ragtag"
//     | "Magic Tree House"
//     | "Howl's Moving Forest"
//     | "Onlyfamilia";
//   tree?: Member;
//   leaves?: Member[];
// }


// Initialize a set to track user pairs that have been together
// Assuming past_groupings is saved and loaded from some source like a JSON file or DB.
const past_groupings: Set<string> = new Set([
    'Miller Liu,John Glen Siy', 'Aditi Mundra,Sahir Tandon', 'Navi Emiliano,Henrique Ribeiro Rodrigues',
    'Ria Jain,Victoria Nguyen', 'Aarushi Shah,Anna Chung', 'Sarah Kiefer,Stephane Finot',
    // Add the rest of the pairs here as strings in the format 'User1,User2'
]);

// Function to check if two users have been in the same group before
function haveBeenTogether(user1: Member, user2: Member): boolean {
    const pair = [user1.name, user2.name].sort().join(',');
    return past_groupings.has(pair);
}

// Function to add the current group to past groupings
function addGrouping(group: Member[]): void {
    for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
            const pair = [group[i].name, group[j].name].sort().join(',');
            past_groupings.add(pair);
        }
    }
}

// Function to calculate the diversity score between two users
function calculateDiversity(user1: Member, user2: Member): number {
    let diversityScore = 0;

    // If they have been grouped together before, return a large negative score
    if (haveBeenTogether(user1, user2)) {
        return -1000;
    }

    // Calculate diversity based on differences in specific fields
    if (user1.grade !== user2.grade) {
        diversityScore += 1;
    }
    
    if (user1.joined !== user2.joined) {
        diversityScore += 1;
    }

    return diversityScore;
}

// Function to calculate the diversity score for a group
function groupDiversity(group: Member[]): number {
    let score = 0;
    for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
            score += calculateDiversity(group[i], group[j]);
        }
    }
    return score;
}

// Function to form diverse groups
async function formDiverseGroups(users: Member[], groupSize: number): Promise<[Member[][], Member[]]> {
    if (groupSize < 1) {
        throw new Error("Group size must be at least 1.");
    }

    const remainingUsers = [...users];
    const diverseGroups: Member[][] = [];
    let ungroupedMembers: Member[] = [];

    while (remainingUsers.length >= groupSize) {
        let bestGroup: Member[] | null = null;
        let bestScore = -1;

        // Try to form a diverse group by sampling 100 times
        for (let i = 0; i < 100; i++) {
            if (remainingUsers.length < groupSize) {
                break;
            }
            const sample = getRandomSample(remainingUsers, groupSize);
            const score = groupDiversity(sample);
            if (score > bestScore) {
                bestScore = score;
                bestGroup = sample;
            }
        }

        if (bestGroup) {
            diverseGroups.push(bestGroup);
            addGrouping(bestGroup);
            // Remove the selected group members from the remaining users
            for (const user of bestGroup) {
                const index = remainingUsers.indexOf(user);
                if (index > -1) {
                    remainingUsers.splice(index, 1);
                }
            }
        } else {
            break;
        }
    }

    ungroupedMembers = remainingUsers;

    return [diverseGroups, ungroupedMembers];
}

// Function to get a random sample of a specified size from an array
function getRandomSample<T>(array: T[], size: number): T[] {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }
    return shuffled.slice(0, size);
}

// Use case for forming groups
async function main() {
    const users = await getMembers(); // Get the list of members from getMembers function

    console.log('Members from firebase:', users.map(user => user.name));
    const groupSize = 2; // Can be 3, 4, or larger as needed
    const [diverseGroups, ungroupedMembers] = await formDiverseGroups(users, groupSize);

    // Print the diverse groups
    diverseGroups.forEach((group, index) => {
        console.log(`Group ${index + 1}:`, group.map(user => user.name));
    });

    // Print ungrouped members
    console.log('Ungrouped Members:', ungroupedMembers.map(user => user.name));

    // Print past groupings (you may want to store and print this from a database or file)
    console.log('Past groupings:', Array.from(past_groupings));
    console.log('Number of past groupings:', past_groupings.size);
}

main().catch((error) => console.error('Error forming groups:', error));
