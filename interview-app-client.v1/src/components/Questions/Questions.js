import "./Questions.css";

const Questions = () => {


    const areas = [
        {
            id: 1,
            name: "First",
            parent: 0,
        },
        {
            id: 2,
            name: "Second",
            parent: 0,
        },
        {
            id: 3,
            name: "First-First",
            parent: 1,
        },
        {
            id: 4,
            name: "First-First-First",
            parent: 3,
        },
        {
            id: 5,
            name: 'Third',
            parent: 0
        }
    ]


  return (
    <h1>Questions</h1>
  );
};

export default Questions;
