import { getMembers } from "../members/firebaseMemberFunctions";
import { Member } from "../members/Member";

//npm install -g tsx
//npx tsx .\random.ts

// Function to randomly assign members to groups based on the number of people per group
const randomGroupMembers = (
  members: Member[],
  peoplePerGroup: number
): { [groupId: string]: Member[] } => {
  const groupedMembers: { [groupId: string]: Member[] } = {};

  // Calculate the number of groups needed
  const totalGroups = Math.ceil(members.length / peoplePerGroup);

  // Initialize groups as empty arrays
  for (let i = 0; i < totalGroups; i++) {
    groupedMembers[`Group ${i + 1}`] = [];
  }

  // Shuffle members to randomize their order
  const shuffledMembers = [...members];
  for (let i = shuffledMembers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledMembers[i], shuffledMembers[j]] = [
      shuffledMembers[j],
      shuffledMembers[i],
    ]; // Swap elements
  }

  // Distribute shuffled members into the groups
  shuffledMembers.forEach((member, index) => {
    const groupIndex = Math.floor(index / peoplePerGroup); // Determines which group the member belongs to
    const groupId = `Group ${groupIndex + 1}`;
    groupedMembers[groupId].push(member);
  });

  return groupedMembers;
};

//Function to print the grouped members in the console
const printGroupedMembers = (groupedMembers: {
  [groupId: string]: Member[];
}): void => {
  for (const groupId in groupedMembers) {
    console.log(`${groupId}:`);
    groupedMembers[groupId].forEach((member) => {
      console.log(`  - ${member.name} (${member.id})`);
    });
  }
};

// Main logic
const main = async () => {
  const members: Member[] = await getMembers(); // Get all the members
  const peoplePerGroup = 2; // Specify how many people per group
  const groupedMembers = randomGroupMembers(members, peoplePerGroup); // Group members randomly

  printGroupedMembers(groupedMembers);
};

main(); // Call the async main function
