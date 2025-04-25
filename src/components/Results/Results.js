import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../Spinner/Spinner';
import { mapExpressionToEmoji } from '../../helpers/emojis';
import './Results.css';

console.log("✅ Results.js file is running!");


const moodColors = {
  happy: '#FFFFC5',       // Gold
  sad: '#2E8A99    ',         // Dodger Blue
  angry: '#FF4500',       // Orange Red
  surprised: '#FFB03B',   // Orange
  neutral: '#DBDBDB',     // Gray
  disgusted: '#8B008B',   // Dark Magenta
  fearful: '#800080'      // Purple
};

const Results = ({ results, processing }) => {
  useEffect(() => {
    console.log("Results updated:", results); // ✅ Log results to check if detection is working
    
    if (results && results.length > 0) {
      const dominantExpression = results[0].expressions.asSortedArray()[0].expression;
      
      console.log("Detected mood:", dominantExpression); // ✅ Debugging
      console.log("Setting background color to:", moodColors[dominantExpression]); // ✅ Debugging
      
      document.body.style.backgroundColor = moodColors[dominantExpression] || "#FFFFFF";
    }
  }, [results]);
  

  if (processing && results) {
    return <Spinner />;
  }

  if (!processing && results && results.length > 0) {
    return (
      <div className="results">
        {results.length > 1 ? (
          <div>
            <p>I think...</p>
            {results.map((result, i) => (
              <div className="results__wrapper" key={i}>
                <div style={{ width: '300px' }}>
                  <p>
                    One of you is probably {result.gender}, is looking {result.expressions.asSortedArray()[0].expression} and looks around{' '}
                    {Math.round(result.age)}
                  </p>
                </div>
                <FontAwesomeIcon icon={mapExpressionToEmoji(result.expressions.asSortedArray()[0].expression)} size="4x" />
                <FontAwesomeIcon icon={mapExpressionToEmoji(result.gender)} size="4x" />
              </div>
            ))}
          </div>
        ) : (
          <div className="results__wrapper">
            <div>
              <p>I think...</p>
              <p>You look {results[0].expressions.asSortedArray()[0].expression}</p>
            </div>
            <div className="results__emoji">
              <FontAwesomeIcon icon={mapExpressionToEmoji(results[0].expressions.asSortedArray()[0].expression)} size="4x" />
              <FontAwesomeIcon icon={mapExpressionToEmoji(results[0].gender)} size="4x" />
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="results">
        <Spinner />
      </div>
    );
  }
};

export default Results;
