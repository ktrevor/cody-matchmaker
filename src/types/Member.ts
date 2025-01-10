export interface Member {
    name: string;
    joined: number;
    gender: 'Male' | 'Female' | 'Non-binary' | 'Other';
    grade: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
    forest: 'Lost in the Woods' | 'Ragtag' | 'Magic Tree House' | "Howl's Moving Forest" | 'Onlyfamilia';
    tree?: Member;
    leaves?: Member[];
}