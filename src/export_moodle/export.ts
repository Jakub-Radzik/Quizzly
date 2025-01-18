export async function exportMoodle(quizData: unknown) {
  // @ts-ignore
  if (!quizData || quizData.questions.length === 0) {
    throw Error("Empty quiz");
  }
  const xmlContent = prepareXML(quizData);
  const blob = new Blob([xmlContent], { type: "application/xml" });

  // Create a downloadable link
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  // @ts-ignore
  a.download = `${quizData.id}_moodle.xml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// @ts-ignore
function prepareXML(quiz) {
  var questionsXML = "";
  for (let i = 0; i < quiz.questions.length; i++) {
    const question = quiz.questions[i];
    const questionName = question.questionText;
    const questionText = question.questionText;

    var questionCorrectSum = 0;
    for (let j = 0; j < question.answers.length; j++) {
      if (question.answers[j].isCorrect) {
        questionCorrectSum += 1;
      }
    }
    if (questionCorrectSum == 0) {
      throw Error("Question has now correct answers");
    }
    const questionFraction = 100 / questionCorrectSum;
    const questionSingle = questionCorrectSum == 1 ? "true" : "false";
    var answersXML = "";
    for (let j = 0; j < question.answers.length; j++) {
      const answer = question.answers[j];
      const answerText = answer.answerText;
      const isAnswerCorrect = answer.isCorrect;
      const answerFraction = isAnswerCorrect ? questionFraction : 0;
      const answerFeedbackText = isAnswerCorrect ? "Correct!" : "Wrong!";
      const answerXML = `
        <answer fraction="${answerFraction}">
            <text>${answerText}</text>
            <feedback><text>${answerFeedbackText}</text></feedback>
        </answer>`;
      answersXML += answerXML;
    }
    const questionXML = `
    <question type="multichoice">
        <name>
            <text>${questionName}</text>
        </name>
        <questiontext format="html">
            <text>${questionText}</text>
        </questiontext>${answersXML}
        <shuffleanswers>1</shuffleanswers>
        <single>${questionSingle}</single>
    </question>`;
    questionsXML += questionXML;
  }
  const output = `<?xml version="1.0" ?> 
<quiz>${questionsXML}
</quiz>`;
  return output;
}
