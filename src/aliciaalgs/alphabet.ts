import { getMembers } from "../members/firebaseMemberFunctions";
import { Member } from "../members/Member";

// Function to sort members alphabetically by name and group them
const groupMembersAlphabetically = (
  members: Member[],
  peoplePerGroup: number
): { [groupId: string]: Member[] } => {
  const groupedMembers: { [groupId: string]: Member[] } = {};

  // Sort members alphabetically by name
  const sortedMembers = [...members].sort((a, b) => a.name.localeCompare(b.name));

  // Calculate the number of groups needed
  const totalGroups = Math.ceil(members.length / peoplePerGroup);

  // Initialize groups as empty arrays
  for (let i = 0; i < totalGroups; i++) {
    groupedMembers[`Group ${i + 1}`] = [];
  }

  // Distribute sorted members into the groups
  sortedMembers.forEach((member, index) => {
    const groupIndex = Math.floor(index / peoplePerGroup); // Determines which group the member belongs to
    const groupId = `Group ${groupIndex + 1}`;
    groupedMembers[groupId].push(member);
  });

  return groupedMembers;
};

// Function to print the grouped members in the console
const printGroupedMembers = (groupedMembers: { [groupId: string]: Member[] }): void => {
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
  const groupedMembers = groupMembersAlphabetically(members, peoplePerGroup); // Group members alphabetically

  // Print out the groupings
  printGroupedMembers(groupedMembers);
};

main(); // Call the async main function
