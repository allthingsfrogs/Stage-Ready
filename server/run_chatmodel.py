from langchain_groq import ChatGroq
from pydantic import BaseModel, Field, conint
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import ChatPromptTemplate
# add dot env
from dotenv import load_dotenv
import os

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class GradingRubric(BaseModel):
    """Information about a grading rubric."""
    
    introductionScore: conint(ge=1, le=5) = Field(
        description="Score for the effectiveness of the introduction (1 to 5, with 5 being excellent)."
    )
    introductionSuggestion: str = Field(
        description="Suggestions for improving the introduction."
    )
    
    toneAndModeScore: conint(ge=1, le=5) = Field(
        description="Score for the appropriateness of tone and mode used (1 to 5)."
    )
    toneAndModeSuggestion: str = Field(
        description="Suggestions for adjusting tone and mode."
    )
    
    smoothnessAndFlowScore: conint(ge=1, le=5) = Field(
        description="Score for the smoothness and flow of the presentation (1 to 5)."
    )
    smoothnessAndFlowSuggestion: str = Field(
        description="Suggestions for enhancing smoothness and flow."
    )
    
    getPointAcrossScore: conint(ge=1, le=5) = Field(
        description="Score for how effectively the main point is conveyed (1 to 5)."
    )
    getPointAcrossSuggestion: str = Field(
        description="Suggestions for making the main point clearer."
    )
    
    conclusionScore: conint(ge=1, le=5) = Field(
        description="Score for the strength and clarity of the conclusion (1 to 5)."
    )
    conclusionSuggestion: str = Field(
        description="Suggestions for improving the conclusion."
    )

def create_grading_chain():
    # Initialize the LLM
    llm = ChatGroq(
        model="mixtral-8x7b-32768",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=GROQ_API_KEY,
    )

    # Create the parser
    parser = PydanticOutputParser(pydantic_object=GradingRubric)

    # Create the prompt template
    system_prompt = """You are a helpful AI bot that checks and grades speeches.
Your task is to evaluate the given speech based on multiple criteria and provide scores and suggestions.
Please provide detailed, constructive feedback for each category.

{format_instructions}"""

    instruction_prompt = """<instruction> 
    You will evaluate the speech based on the following criteria:
    Introduction (1-5)
    Evaluate how well the speaker introduces the topic, whether they engage the audience, and the clarity of the thesis.
    Tone/Mood (1-5)
    Analyze how the speaker conveys emotion, energy, and tone, and whether the audience stays engaged.
    Smoothness/Flow (1-5)
    Assess how smooth the transitions are, the pacing of the speech, and whether it flows naturally.
    Gets the Point Across (1-5)
    Evaluate how clearly the speaker communicates the main points and if the audience would understand the message.
    Conclusion (1-5)
    Assess the conclusion for its effectiveness in summarizing the speech and reinforcing the key ideas.
    After evaluating each category, provide a summary of the strengths and areas of improvement for the speaker.
    <instruction>"""

    example_prompt_average = """<example><speech>Good morning everyone! Today, I want to talk to you about something we all struggle with—time management. 
    Whether you're a student, a professional, or just trying to get through the day, managing your time effectively is crucial for success. 
    Time is the one resource we can't get back, yet so many of us waste it. From procrastination to distractions, we often let valuable moments 
    slip by. But by prioritizing tasks, setting realistic goals, and staying organized, we can achieve so much more in both our personal and professional 
    lives. Effective time management is not about cramming as much as possible into your schedule. It's about making time for what truly matters,
    ensuring you're not overwhelmed by less important tasks. When you manage your time well, you'll find yourself less stressed and more productive. 
    In conclusion, time management isn't just about staying busy; it's about staying effective. So, take control of your time, prioritize wisely, and 
    watch as you become more focused, less stressed, and ultimately more successful.</speech>
    <critique>
    Introduction: 4 – Grabs audience attention, explains the topic clearly.
    Tone/Mood: 3 – The speaker uses a steady tone but could have shown more energy or passion.
    Smoothness/Flow: 4 – The delivery is smooth with good pacing, but some parts could have flowed better.
    Gets the Point Across: 3 – The message is clear, but certain points could be emphasized more for clarity.
    Conclusion: 4 – Strong closing, reinforces the main idea but lacks a more powerful call to action.
    </critique></example>
    """

    example_prompt_bad = """<example><speech>Uh… yeah, so today, uh, I’m gonna talk about, uh, reading. Um, it’s, like, important because, well, uh, yeah, you should read 
    books. So, um, reading helps you, like, learn things. Uh, it’s good for your brain and stuff, and uh, you know, like, it can make you smarter. Uh, books
    have, um, stories in them, and some are, like, good. Um, yeah, reading is cool, I guess. Uh, some people don’t read, and that’s bad, I think. Um, anyway, 
    yeah, reading is good. You should try it, because, like, it helps you and stuff. Yeah, um, that’s all I have to say about reading. Uh, thanks, I guess.</speech>
    <critique>
    Introduction: 1 – No clear introduction, lacks structure and clarity.
    Tone/Mood: 1 – No real tone or mood is conveyed, very monotone and unsure.
    Smoothness/Flow: 1 – Halting delivery, many awkward pauses, and lack of transitions.
    Gets the Point Across: 1 – The speech is incoherent, with unclear and rambling points.
    Conclusion: 1 – Abrupt ending with no sense of closure or reinforced ideas.
    </critique></example>
    """

    example_prompt_good = """<example><speech>Good evening, everyone! Imagine a world where clean energy is limitless, where diseases are cured with a single treatment, and where
    technology seamlessly integrates with our lives, making every day more efficient and more meaningful. This isn’t science fiction—it’s the power of innovation. 
    Today, I’m excited to share how innovation is not only shaping our present but is also the key to unlocking a brighter future for us all. Innovation is the 
    driving force behind the most transformative changes in human history. From the invention of the wheel to the development of the internet, innovation has always 
    been the catalyst for progress. But today, we stand at the cusp of an even greater revolution. Artificial intelligence, renewable energy, and medical advancements 
    are poised to solve some of the world’s most pressing challenges. Consider artificial intelligence. It is already reshaping industries, from healthcare to finance,
    creating new opportunities for growth and efficiency. In medicine, cutting-edge research is paving the way for treatments that could eradicate previously untreatable
    diseases. Meanwhile, renewable energy sources like solar and wind are offering sustainable alternatives to fossil fuels, potentially ending our reliance on environmentally 
    harmful energy. But innovation doesn’t just happen on its own. It requires vision, collaboration, and the courage to take risks. History shows us that the greatest innovations 
    arise when we dare to challenge the status quo and think beyond the boundaries of what’s possible. In conclusion, innovation is not just a tool—it’s the foundation upon which our 
    future is being built. By embracing new ideas and technologies, we have the opportunity to shape a world that is healthier, more sustainable, and more connected than ever before. 
    So let’s push the boundaries of what we think is possible, because the future we dream of is within our reach. Thank you</speech>
    <critique>
    Introduction: 5 – Exceptional, captivating introduction with a clear thesis and seamless transitions.
    Tone/Mood: 5 – Excellent tone, conveying excitement and energy, keeping the audience fully engaged.
    Smoothness/Flow: 5 – Natural, fluid delivery with well-paced transitions and pauses, maintaining a perfect rhythm.
    Gets the Point Across: 5 – The message is crystal clear, and key points are emphasized and reinforced effectively.
    Conclusion: 5 – Strong, inspiring conclusion that reinforces the main idea and leaves the audience with a sense of direction and optimism.
    </critique></example> """

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("system", instruction_prompt),
        ("system", example_prompt_average),
        ("system", example_prompt_bad),
        ("system", example_prompt_good),
        ("human", "Please evaluate this speech: {speech}")
    ])


    # Create the chain
    chain = (
        prompt.partial(format_instructions=parser.get_format_instructions())
        | llm 
        | parser
    )

    return chain

def run_chatmodel(speech: str):
    try:
        # Create the chain
        chain = create_grading_chain()
        
        # Sample speech for testing
        test_speech = """Hello, I am Eugene, a helpful AI bot that checks and grades speeches."""

        
        # Run the chain
        result = chain.invoke({"speech": speech})
        
        result = result.model_dump()

        print(result)
        return result
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")

if __name__ == "__main__":
    run_chatmodel("Hello, I am Eugene, a helpful AI bot that checks and grades speeches.")
