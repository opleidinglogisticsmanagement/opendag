import { useState } from 'react';
import { quizQuestions, quizResults } from '../../data/quizQuestions';
import QuestionCard from './QuestionCard';
import Card from '../UI/Card';
import Button from '../UI/Button';

const QuizContainer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({
    visie: 0,
    data: 0,
    samen: 0,
    zelf: 0
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleAnswer = (selectedOption) => {
    // Update scores based on selected option
    const newScores = {
      visie: scores.visie + selectedOption.scores.visie,
      data: scores.data + selectedOption.scores.data,
      samen: scores.samen + selectedOption.scores.samen,
      zelf: scores.zelf + selectedOption.scores.zelf
    };
    setScores(newScores);
    
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleStart = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScores({ visie: 0, data: 0, samen: 0, zelf: 0 });
    setQuizFinished(false);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setScores({ visie: 0, data: 0, samen: 0, zelf: 0 });
    setQuizFinished(false);
  };

  const getProfile = () => {
    // Determine which axis has the majority
    const focusMajority = scores.visie > scores.data ? 'visie' : 'data';
    const approachMajority = scores.samen > scores.zelf ? 'samen' : 'zelf';
    
    // Map to profile
    if (focusMajority === 'visie' && approachMajority === 'samen') {
      return 'regisseur';
    } else if (focusMajority === 'visie' && approachMajority === 'zelf') {
      return 'innovator';
    } else if (focusMajority === 'data' && approachMajority === 'zelf') {
      return 'analist';
    } else { // data + samen
      return 'technoloog';
    }
  };

  if (!quizStarted && !quizFinished) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            Welke beroepsprofielen zijn er?
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(quizResults).map(([key, profile]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <div className="text-center mb-3">
                  <div className="text-4xl mb-2">{profile.icon}</div>
                  <h4 className="text-base font-bold text-gray-800 mb-3">{profile.roleName}</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {profile.shortDescription}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Button onClick={handleStart} variant="primary" className="px-6 py-2">
            Start de Test
          </Button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    const profile = getProfile();
    const result = quizResults[profile];
    
    return (
      <Card className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-7xl mb-4">{result.icon}</div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{result.title}</h2>
        </div>
        
        <div className="space-y-6 mb-8">
          <div className="bg-logistics-light-blue p-6 rounded-lg">
            <p className="text-gray-700 text-lg leading-relaxed">
              {result.description}
            </p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Match met de Opleiding</h3>
            <p className="text-gray-700 leading-relaxed">
              {result.match}
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={handleRestart} variant="primary">
            Opnieuw Doen
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <QuestionCard
      question={quizQuestions[currentQuestion]}
      onAnswer={handleAnswer}
      questionNumber={currentQuestion + 1}
      totalQuestions={quizQuestions.length}
    />
  );
};

export default QuizContainer;
