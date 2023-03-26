import AppContext from "@/AppContext";
import Sidebar from "@/components/Sidebar";
import { fetchReport } from "@/utils/fetchReport";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import axios from "axios";

const Page = () => {
  // const router = useRouter();
  const { query, isReady } = useRouter();

  const { setSurveyQuestions, surveyQuestions } = useContext(AppContext);

  const [id, setId] = useState(0)

  
  if (!isReady) return null;
  
  React.useEffect(() => {
    const getData = async () => {
      const response = await fetchReport(query.id);
      console.log(response.id)

      setId(response.id)
      
      setSurveyQuestions(response.questions_answers);
    };
    getData();
    console.log(surveyQuestions);
  }, []);

  const [answers,setAnswers] = useState([])
  const [allAnswers,setAllAnswers] = useState({})

  const handleChange = (e) => {
    setAnswers({...answers, [e.target.name]: e.target.value})
    
  }

  // console.log(answers)


  const handleClick = async() => {
    // alert("Clicked!")
    // alert(answers)
    const test = surveyQuestions.map((question, index)=>{
      // return {...question, answer:answers[index]}
      return {...question, answer:answers[question.question]}
    })
    // console.log({
    //   "status": "Completed",
    //   "question_answers": test
    // });
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/feedback/${id}/`, {
      "status":"Completed",
      "questions_answers": test
    },{
      headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log(response)
    if(response.status == 200){
      setAllAnswers({})
    }
    // console.log(answers)
    // console.log(surveyQuestions);
    // setAllAnswers()
  }

  // console.log(surveyQuestions);
  
  return (
    <div className="flex flex-col justify-center items-center">
    <div className="flex w-screen overflow-x-hidden">
      <Sidebar />
      <div className="py-10 px-4">
        <p className="mb-8 text-xl font-semibold pl-[20.5rem]">Self Review</p>
        <div>
          {surveyQuestions.map((question, i) => (
            <div key={i} className="pl-[20.5rem]">
              <p className="my-5 font-semibold">Question {i + 1}</p>
              <p className="font-light mb-3">{question.question}</p>
              <textarea
                rows={6}
                cols={50}
                className={
                  "rounded-lg bg-gray-200 resize-none overflow-x-hidden focus:outline-none p-5 text-sm border border-gray-500"
                }
                placeholder={"Enter your answer..."}
                name={question.question}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
      <div className= "pl-[26.5rem]">
        <button className="bg-sky-400 w-[4vw] rounded-md font-bold" onClick={handleClick} >Save</button>
      </div>
    </div>
  );
};

export default Page;
