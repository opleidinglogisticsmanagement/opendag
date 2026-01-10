import Card from '../UI/Card';

const QuestionCard = ({ question, onAnswer, questionNumber, totalQuestions }) => {
  const handleSelect = (index) => {
    // Direct doorgaan naar volgende vraag
    onAnswer(question.options[index]);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="mb-4 text-sm text-gray-500 font-medium">
        Vraag {questionNumber} van {totalQuestions}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{question.question}</h3>
      
      {question.situation && (
        <div className="mb-6 p-4 bg-logistics-light-blue rounded-lg border-l-4 border-logistics-blue">
          <p className="text-gray-700 text-lg italic">
            <strong>Situatie:</strong> {question.situation}
          </p>
        </div>
      )}
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 border-gray-300 hover:border-logistics-blue hover:bg-logistics-light-blue text-gray-700";

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={buttonClass}
            >
              <span className="font-semibold mr-2">{index === 0 ? 'A.' : 'B.'}</span>
              {option.text}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-logistics-blue h-2 rounded-full transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
