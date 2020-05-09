// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.


//speakOutput += "<audio src='https://alexa-quiz-math.s3.eu-central-1.amazonaws.com/quiz.mp3'/>";
//speakOutput += "<audio src='soundbank://soundlibrary/alarms/buzzers/buzzers_09'/>";
const Alexa = require('ask-sdk-core');

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const number1 = randomIntFromInterval(1,10);
        const number2 = randomIntFromInterval(1,10);
        
        const speakOutput = `<say-as interpret-as='interjection'>C'est parti !</say-as> Combien font <say-as interpret-as="cardinal">${number1}</say-as> fois <say-as interpret-as="cardinal">${number2}</say-as>?`;

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        sessionAttributes.expected_result = number1 * number2;
        sessionAttributes.nb_question = 1;
        sessionAttributes.nb_success = 0;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        
        
        /*try {
            const metadata = {
                title: 'Quiz Mathématiques'
            };
            const audiofile = 'https://alexa-quiz-math.s3.eu-central-1.amazonaws.com/quiz.mp3';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput)
                .addAudioPlayerPlayDirective("REPLACE_ALL", audiofile, audiofile, 0, null, metadata).withShouldEndSession(false).getResponse();
        }
        catch (err) {
            console.log(`~~~~ LaunchRequestHandler => Error handled: ${err.stack}`);
        }*/
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard('Quiz Mathématiques', '5 questions de multiplication')
            .getResponse();
    }
};
const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
    async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const answer = handlerInput.requestEnvelope.request.intent.slots.answer.value;
        
        if (answer == sessionAttributes.expected_result) {
            sessionAttributes.nb_success = sessionAttributes.nb_success + 1;
        }
        
        if (sessionAttributes.nb_question < 5) {
            
            const number1 = randomIntFromInterval(1,10);
            const number2 = randomIntFromInterval(1,10);
            
            let comment = "Ok!";
            if (answer != sessionAttributes.expected_result) {
                comment = "Pas facile, hein? "; 
            }
                    
                    
            const speakOutput = `<say-as interpret-as='interjection'>${comment}</say-as> Et <say-as interpret-as="cardinal">${number1}</say-as> fois <say-as interpret-as="cardinal">${number2}</say-as>?`;
            const speakOutput2 = "espèce de débile, Je t'ai demandé ".concat(number1).concat(" fois ").concat(number2).concat("?");
            
            sessionAttributes.expected_result = number1 * number2;
            sessionAttributes.nb_question = sessionAttributes.nb_question + 1;
            
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
                /*const primaryText = new Alexa.RichTextContentHelper().withPrimaryText(getTextDescription(item, "<br/>")).getTextContent();
            responseBuilder.addRenderTemplateDirective({
              type: 'BodyTemplate2',
              backButton: 'visible',
              image,
              title,
              textContent: primaryText,
            });
            
            try {
                const metadata = {
                    title: 'Quiz Mathématiques'
                };
                const audiofile = 'https://alexa-quiz-math.s3.eu-central-1.amazonaws.com/quiz.mp3';
                return handlerInput.responseBuilder
                    .speak(speakOutput)
                    .reprompt(speakOutput2)
                    .addAudioPlayerPlayDirective("REPLACE_ALL", audiofile, "title", 0, null, null).withShouldEndSession(false).getResponse();
            }
            catch (err) {
                console.log(`~~~~ LaunchRequestHandler => Error handled: ${err.stack}`);
            }*/
            
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt(speakOutput2)
                .addElicitSlotDirective('answer')
                .getResponse();
              
        }
        else {
            return handlerInput.responseBuilder
                .speak("Tu as ".concat(sessionAttributes.nb_success).concat(" réponses justes.").concat("<say-as interpret-as='interjection'>Au revoir</say-as>."))
                .withShouldEndSession(true)
                .getResponse();
        }
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = "<say-as interpret-as='interjection'>Au revoir!</say-as>";
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `<say-as interpret-as='interjection'>Oh mince</say-as>, j'ai planté comme une poufiasse.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .withSkillId("amzn1.ask.skill.97f9c118-747f-47ed-8f3c-9300a6ef33a3")
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
