export interface Member {
    name: string;
    gender: 'Male' | 'Female';
    grade: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    forest: 'Lost in the Woods' | 'Ragtag' | 'Magic Tree House' | "Howl's" | 'Onlyfamilia';
    tree: Member;
    leaves?: Member[];
}