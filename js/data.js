/* ==========================================================================
   data.js
   All COS102 (Problem Solving) course content lives here: modules, lessons,
   quiz question banks, flashcards, guided lab problems and achievement
   definitions. Keeping content separate from rendering logic means the UI
   code never needs to change to add/adjust course material.
   ========================================================================== */

(function (App) {
  'use strict';

  var MODULES = [
    {
      id: 1,
      slug: 'foundations',
      title: 'Foundations of Problem Solving',
      icon: 'compass',
      description: 'What problem solving really means in computing, and the mindset that turns a vague problem into a solvable one.',
      objectives: [
        'Define what a "problem" means in a computing context',
        'Explain why problem solving is the core skill behind all programming',
        'Describe the six-stage problem-solving process',
        'Apply the process to a simple everyday problem'
      ],
      lessons: [
        {
          id: '1-1',
          title: 'What Is Problem Solving?',
          intro: 'Before you write a single line of code, you need to understand the skill that all code exists to serve: solving problems. This lesson sets the foundation for everything else in COS102.',
          objectives: [
            'Define "problem" and "problem solving" in a computing sense',
            'Distinguish a well-defined problem from an ill-defined one',
            'Understand why computers cannot solve problems on their own'
          ],
          explanation: [
            'A **problem**, in computing, is simply a gap between a current state and a desired state, where the path between them is not immediately obvious. If the path were obvious, there would be nothing to "solve" - you would just do it. Problem solving is the deliberate process of finding a reliable path from the current state to the desired state.',
            'It is important to separate problem solving from programming. Programming is *writing instructions in a language a computer understands*. Problem solving happens **before** that - it is the thinking work of figuring out exactly what needs to happen, in what order, before you translate any of it into code. A student who jumps straight into typing code without first solving the problem on paper almost always ends up with confused, buggy programs.',
            'Computers are extremely fast but extremely literal. They do not "figure things out" - they follow instructions exactly as given, including any mistakes in those instructions. This is why the human problem-solving stage matters so much: the computer will faithfully execute a flawed plan just as quickly as a correct one.',
            'Problems can be **well-defined** (the goal, the starting point and the rules are all clear - e.g. "calculate the average of three numbers") or **ill-defined** (the goal is vague or the constraints are unclear - e.g. "make the app feel faster"). Good problem solvers spend real effort turning ill-defined problems into well-defined ones before attempting a solution.'
          ],
          examples: [
            'Well-defined problem: "Given the length and width of a rectangle, calculate its area." The inputs, the process and the expected output are all completely clear.',
            'Ill-defined problem: "Make students enjoy registration week more." Here the goal is subjective and there is no single measurable output - it needs to be broken down and clarified first.'
          ],
          keyPoints: [
            'Problem solving is a thinking process; programming is an implementation step that comes after it.',
            'A computer executes instructions exactly as written - it cannot correct a flawed plan on its own.',
            'Well-defined problems have a clear start, a clear goal and clear rules for getting from one to the other.',
            'Ill-defined problems must be clarified and narrowed before you can design a solution.'
          ],
          commonMistakes: [
            'Opening a code editor before understanding what the problem is actually asking.',
            'Assuming the computer will "know what you mean" if your instructions are ambiguous.',
            'Treating an ill-defined problem as if it were already well-defined, and solving the wrong thing.'
          ],
          practicalExample: 'Imagine you are asked to "write a program that tells students if they passed." That is ill-defined - passed what, out of what total, and what is the pass mark? Clarifying it turns it into a well-defined problem: "Given a score out of 100, output PASS if the score is 50 or greater, otherwise output FAIL."',
          exercise: {
            prompt: 'Rewrite this ill-defined problem as a well-defined one: "Build a system that helps students with their timetable."',
            guidance: 'A strong answer narrows the goal to something specific and measurable, for example: "Given a student\'s course list and the master timetable, list the day and time of each of that student\'s classes, and flag any two classes that clash in time."'
          }
        },
        {
          id: '1-2',
          title: 'The Problem-Solving Process',
          intro: 'Experienced problem solvers do not work randomly - they follow a repeatable process. This lesson walks through the six stages you will use for every problem in this course, and every program you ever write.',
          objectives: [
            'List and describe the six stages of the problem-solving process',
            'Explain why testing and evaluation happen even after a solution "works"',
            'Apply the process, stage by stage, to a small problem'
          ],
          explanation: [
            'The problem-solving process used throughout COS102 has six stages: **1. Define the problem, 2. Analyze the problem, 3. Plan the solution, 4. Implement the plan, 5. Test the solution, 6. Evaluate and refine.** These stages are not always strictly linear - you may go back a stage when you discover something new - but skipping a stage almost always costs you more time later than it saves.',
            '**Define** means stating, in plain language, exactly what is being asked. **Analyze** means identifying the inputs you are given, the output you must produce, and any constraints or rules that apply. **Plan** means designing the logic - usually as an algorithm, flowchart or pseudocode - before writing any real code. **Implement** means carrying out the plan, whether that is writing a program or, at this early stage of the course, working the logic through by hand. **Test** means checking the solution against a range of cases, including tricky edge cases, not just the "easy" case you had in mind while designing it. **Evaluate** means asking whether the solution is correct, efficient, and readable, and refining it if not.',
            'A very common failure pattern is to stop after the Implement stage because the solution "seems to work." Testing with only one obvious input often hides serious bugs. A solution that correctly averages three positive numbers might completely break when given a negative number or a zero - you only find out if you deliberately test those cases.'
          ],
          examples: [
            'Problem: "Find the largest of three numbers." Define: state it in one sentence. Analyze: inputs are three numbers, output is the largest one. Plan: compare the first two, keep the larger, then compare that result with the third. Implement: work the comparisons by hand or in code. Test: try (3,7,5), (7,3,5), (5,5,5) and (-1,-8,-3). Evaluate: does it still work when all three numbers are equal, or all negative?'
          ],
          keyPoints: [
            'The six stages are: Define, Analyze, Plan, Implement, Test, Evaluate.',
            'Planning the logic before implementing it saves far more time than it costs.',
            'Testing must include edge cases (zero, negative numbers, empty input, duplicate values), not just the obvious "happy path."',
            'Evaluation is about correctness, efficiency and clarity, not just "does it run."'
          ],
          commonMistakes: [
            'Skipping the Analyze stage and guessing at what the inputs and outputs should be.',
            'Testing only the case you had in mind while writing the solution.',
            'Treating "it ran without an error" as proof that the solution is correct.'
          ],
          practicalExample: 'For "calculate the average of a list of exam scores," a rushed solver might implement it, run it once with three tidy scores, see a sensible-looking number, and stop. A careful solver also tests an empty list (which would cause a division by zero) and a list with one score, before calling the solution finished.',
          exercise: {
            prompt: 'Take the problem "determine whether a given year is a leap year" and write one sentence for each of the six stages of the process.',
            guidance: 'Your Analyze stage should note the input is a single year and the output is Yes/No. Your Test stage should specifically mention trying a year divisible by 4 but not 100 (leap), a year divisible by 100 but not 400 (not leap), and a year divisible by 400 (leap) - these are exactly the edge cases the rule depends on.'
          }
        }
      ],
      quiz: [
        { id: 'm1q1', type: 'mcq', topic: 'Problem definition', question: 'In computing, a "problem" is best described as:', options: ['A gap between a current state and a desired state where the path is not obvious', 'Any error message shown by a compiler', 'A task that only an expert can complete', 'A question with no possible answer'], correct: 0, explanation: 'A problem exists when there is a desired outcome but the route to reach it is not immediately obvious.' },
        { id: 'm1q2', type: 'mcq', topic: 'Programming vs problem solving', question: 'Which statement best describes the relationship between problem solving and programming?', options: ['They are the same activity', 'Problem solving is the thinking stage that should happen before programming', 'Programming always comes before problem solving', 'Problem solving is unnecessary if you know a programming language'], correct: 1, explanation: 'Problem solving is the planning and reasoning work that should be done before code is written.' },
        { id: 'm1q3', type: 'tf', topic: 'Computers and instructions', question: 'True or False: A computer can recognize and automatically correct a flawed plan while executing it.', options: ['True', 'False'], correct: 1, explanation: 'Computers execute instructions exactly as given, including any mistakes - they do not correct flawed logic on their own.' },
        { id: 'm1q4', type: 'mcq', topic: 'Well-defined problems', question: 'Which of these is an example of a well-defined problem?', options: ['Make the cafeteria more popular', 'Given a temperature in Celsius, convert it to Fahrenheit', 'Improve student happiness', 'Make the website look nicer'], correct: 1, explanation: 'A clear input, a clear rule, and a clear output make this problem well-defined.' },
        { id: 'm1q5', type: 'mcq', topic: 'Ill-defined problems', question: 'An "ill-defined" problem is one where:', options: ['There is no computer available to solve it', 'The goal, inputs, or rules are unclear and need clarification first', 'It has already been solved before', 'It requires more than one line of code'], correct: 1, explanation: 'Ill-defined problems need to be narrowed and clarified before a solution can be designed.' },
        { id: 'm1q6', type: 'scenario', topic: 'Clarifying problems', question: 'A lecturer says: "Write a program that checks if students did well in the test." What should you do first?', options: ['Immediately start writing code', 'Ask or decide what score counts as "doing well" and what the input/output should be', 'Assume every student did well', 'Skip the task since it is unclear'], correct: 1, explanation: 'The problem is ill-defined until a specific pass threshold and clear input/output are established.' },
        { id: 'm1q7', type: 'mcq', topic: 'Process stages', question: 'Which of the following lists the six stages of the problem-solving process in the correct order?', options: ['Implement, Define, Test, Analyze, Plan, Evaluate', 'Define, Analyze, Plan, Implement, Test, Evaluate', 'Plan, Test, Define, Analyze, Evaluate, Implement', 'Analyze, Define, Test, Plan, Implement, Evaluate'], correct: 1, explanation: 'The standard order is Define, Analyze, Plan, Implement, Test, Evaluate.' },
        { id: 'm1q8', type: 'mcq', topic: 'Define stage', question: 'The "Define" stage of the problem-solving process is mainly concerned with:', options: ['Writing the final code', 'Stating clearly, in plain language, exactly what is being asked', 'Testing edge cases', 'Choosing a programming language'], correct: 1, explanation: 'Define is about stating the problem clearly before any analysis or planning begins.' },
        { id: 'm1q9', type: 'mcq', topic: 'Analyze stage', question: 'During the "Analyze" stage, a problem solver should identify:', options: ['Only the final answer', 'The inputs, the required output, and any constraints', 'The programming language syntax', 'The exam date'], correct: 1, explanation: 'Analyze focuses on inputs, outputs and constraints/rules.' },
        { id: 'm1q10', type: 'mcq', topic: 'Plan stage', question: 'Designing an algorithm, flowchart, or pseudocode before writing real code belongs to which stage?', options: ['Test', 'Evaluate', 'Plan', 'Define'], correct: 2, explanation: 'The Plan stage is where the logic is designed before implementation.' },
        { id: 'm1q11', type: 'tf', topic: 'Testing', question: 'True or False: Testing a solution with only the "easy" expected input is enough to prove it is correct.', options: ['True', 'False'], correct: 1, explanation: 'Testing must include edge cases such as zero, negative numbers, or empty input, not just the obvious case.' },
        { id: 'm1q12', type: 'mcq', topic: 'Edge cases', question: 'Which of these is the best example of an "edge case" when testing a program that averages a list of numbers?', options: ['A list of five ordinary positive numbers', 'An empty list', 'A list with one very readable number', 'A list sorted in ascending order'], correct: 1, explanation: 'An empty list is an edge case because it could cause a division-by-zero error.' },
        { id: 'm1q13', type: 'mcq', topic: 'Evaluate stage', question: 'The "Evaluate" stage asks whether a solution is:', options: ['Only whether it compiles', 'Correct, efficient and clear, with room for refinement', 'Written in the newest programming language', 'Shorter than 10 lines'], correct: 1, explanation: 'Evaluation considers correctness, efficiency and readability, not just whether the program runs.' },
        { id: 'm1q14', type: 'scenario', topic: 'Applying the process', question: 'You wrote a program to find the largest of three numbers, and it worked correctly for (3, 7, 5). Have you finished testing?', options: ['Yes, one correct test is always enough', 'No - you should also test cases like equal numbers and negative numbers', 'No, you should rewrite the whole program', 'Yes, because three numbers were used'], correct: 1, explanation: 'Testing should cover multiple cases, including equal values and negative numbers, before you trust the solution.' },
        { id: 'm1q15', type: 'mcq', topic: 'Process flexibility', question: 'Is the six-stage problem-solving process always followed in a strict straight line?', options: ['Yes, you must never revisit an earlier stage', 'No, you may return to an earlier stage when new information is discovered', 'No, the stages can be done in any random order with the same result', 'Yes, but only for large problems'], correct: 1, explanation: 'The process is iterative - discovering new information can send you back to an earlier stage such as Analyze or Plan.' },
        { id: 'm1q16', type: 'mcq', topic: 'Why problem solving matters', question: 'Why is problem solving considered the core skill behind all programming?', options: ['Because it replaces the need to learn any programming language', 'Because clear thinking about the problem determines whether the resulting code will be correct', 'Because it is only useful for mathematics', 'Because employers do not value it'], correct: 1, explanation: 'Programming translates a solution into code - if the underlying thinking is flawed, the code will be too.' }
      ],
      flashcards: [
        { id: 'm1f1', front: 'Problem (computing definition)', back: 'A gap between a current state and a desired state where the path between them is not immediately obvious.' },
        { id: 'm1f2', front: 'Well-defined problem', back: 'A problem with a clear starting point, a clear goal, and clear rules for getting from one to the other.' },
        { id: 'm1f3', front: 'Ill-defined problem', back: 'A problem whose goal, inputs, or rules are unclear and must be clarified before a solution can be designed.' },
        { id: 'm1f4', front: 'Define (stage 1)', back: 'Stating clearly, in plain language, exactly what the problem is asking.' },
        { id: 'm1f5', front: 'Analyze (stage 2)', back: 'Identifying the inputs, the required output, and any constraints or rules.' },
        { id: 'm1f6', front: 'Plan (stage 3)', back: 'Designing the logic of the solution - as an algorithm, flowchart, or pseudocode - before implementing it.' },
        { id: 'm1f7', front: 'Implement (stage 4)', back: 'Carrying out the plan, e.g. writing the actual program code.' },
        { id: 'm1f8', front: 'Test (stage 5)', back: 'Checking the solution against a range of cases, including tricky edge cases.' },
        { id: 'm1f9', front: 'Evaluate (stage 6)', back: 'Judging whether the solution is correct, efficient and clear, and refining it if not.' }
      ]
    },

    {
      id: 2,
      slug: 'algorithms',
      title: 'Algorithms',
      icon: 'route',
      description: 'What an algorithm is, the properties every valid algorithm must have, and how to judge whether one is any good.',
      objectives: [
        'Define what an algorithm is',
        'List and explain the essential characteristics of a valid algorithm',
        'Understand efficiency at a basic, intuitive level',
        'Write a simple algorithm in numbered-step form'
      ],
      lessons: [
        {
          id: '2-1',
          title: 'Understanding Algorithms',
          intro: 'An algorithm is the precise, step-by-step plan behind every working program. This lesson defines algorithms and shows what makes one valid.',
          objectives: [
            'Define "algorithm"',
            'Write an algorithm as a numbered list of steps',
            'Distinguish an algorithm from a general problem-solving idea'
          ],
          explanation: [
            'An **algorithm** is a finite, ordered sequence of well-defined steps that, if followed exactly, solves a specific problem or performs a specific task. The word "finite" matters - an algorithm must end after a limited number of steps, not run forever. The word "well-defined" matters too - each step must be precise enough that there is no ambiguity about what to do.',
            'An algorithm is more specific than a general plan. "Sort the list" is an idea, not yet an algorithm. "Compare each pair of neighboring numbers; if the left one is bigger than the right one, swap them; repeat this pass through the whole list until a pass makes no swaps" is an algorithm, because every action is precisely specified.',
            'Algorithms exist independently of any programming language. The same algorithm for finding the largest number in a list could be implemented in Python, Java, or C - the algorithm is the *idea*, the code is one particular *expression* of that idea.'
          ],
          examples: [
            'Algorithm to find the largest of three numbers:\n1. Start.\n2. Read three numbers A, B, C.\n3. Set LARGEST to A.\n4. If B is greater than LARGEST, set LARGEST to B.\n5. If C is greater than LARGEST, set LARGEST to C.\n6. Display LARGEST.\n7. Stop.'
          ],
          keyPoints: [
            'An algorithm is a finite, ordered sequence of precise steps that solves a specific problem.',
            'Every step must be unambiguous - there should be only one way to interpret it.',
            'An algorithm must terminate; it cannot run forever.',
            'The same algorithm can be implemented in many different programming languages.'
          ],
          commonMistakes: [
            'Writing vague steps such as "process the data" instead of exactly what to do to it.',
            'Forgetting a stopping condition, which risks the algorithm never terminating.',
            'Confusing "an idea for solving a problem" with "an algorithm" - an algorithm needs precision, not just intent.'
          ],
          practicalExample: 'A vague plan like "check if a number is even" becomes a real algorithm once written precisely: "1. Start. 2. Read the number N. 3. Divide N by 2 and find the remainder. 4. If the remainder is 0, display \'Even\'; otherwise display \'Odd\'. 5. Stop."',
          exercise: {
            prompt: 'Write a numbered algorithm that takes a person\'s age and displays "Minor" if it is under 18, or "Adult" otherwise.',
            guidance: 'A correct algorithm needs a Start step, a Read step for the age, a decision step comparing age to 18, an output step for each branch, and a Stop step.'
          }
        },
        {
          id: '2-2',
          title: 'Algorithm Characteristics & Efficiency',
          intro: 'Not every list of steps qualifies as a good algorithm. This lesson covers the five defining characteristics of algorithms, and introduces efficiency - why some correct algorithms are still better than others.',
          objectives: [
            'List the five essential characteristics of a valid algorithm',
            'Explain, at a basic level, why efficiency matters',
            'Compare two algorithms that solve the same problem differently'
          ],
          explanation: [
            'Every valid algorithm shares five characteristics: **1. Finiteness** - it must terminate after a finite number of steps. **2. Definiteness** - every step must be precisely and unambiguously defined. **3. Input** - it takes zero or more well-specified inputs. **4. Output** - it produces one or more outputs related to the inputs. **5. Effectiveness** - every step must be basic enough to be carried out, in principle, by a person using pencil and paper in a finite amount of time.',
            'Two algorithms can both be correct and still differ in **efficiency** - roughly, how much work (time) or memory (space) they need as the size of the input grows. For example, to find whether a specific name is present in a class list, you could check every name one by one (a "linear search"), or, if the list is sorted alphabetically, repeatedly split the list in half (a "binary search"). Both are correct algorithms, but binary search generally examines far fewer names, especially as the list grows large.',
            'At this stage of the course you are not expected to calculate formal complexity - only to understand, intuitively, that the *number of steps an algorithm takes* is a meaningful way to compare two correct solutions to the same problem.'
          ],
          examples: [
            'Linear search: look at each item in a list, one at a time, until the target is found or the list ends. For a list of 1,000 items, this could take up to 1,000 comparisons.',
            'Binary search (sorted list only): compare the target to the middle item; discard the half that cannot contain it; repeat on the remaining half. For 1,000 items, this takes at most about 10 comparisons.'
          ],
          keyPoints: [
            'The five characteristics of an algorithm: Finiteness, Definiteness, Input, Output, Effectiveness.',
            'Finiteness means it must end; Definiteness means each step is unambiguous.',
            'Effectiveness means each step is basic enough to actually be carried out.',
            'Efficiency compares how much work two correct algorithms need as input size grows.'
          ],
          commonMistakes: [
            'Believing that if a program "gives the right answer eventually," finiteness does not matter.',
            'Assuming the first correct algorithm found is automatically the best one.',
            'Forgetting that binary search requires the list to already be sorted - using it on an unsorted list gives wrong results.'
          ],
          practicalExample: 'Searching a printed, alphabetically-sorted dictionary for a word is naturally closer to binary search - you open near the middle, and jump left or right - while flipping through an unsorted stack of index cards one at a time is linear search. The sorted case is dramatically faster for large collections.',
          exercise: {
            prompt: 'Explain, in your own words, why an algorithm that never stops (for example, one with a loop condition that can never become false) fails the definition of an algorithm.',
            guidance: 'A strong answer references the "Finiteness" characteristic directly: an algorithm must terminate after a finite number of steps, so a non-terminating loop disqualifies it as an algorithm, even if each individual step is well defined.'
          }
        }
      ],
      quiz: [
        { id: 'm2q1', type: 'mcq', topic: 'Algorithm definition', question: 'An algorithm is best defined as:', options: ['Any computer program written in any language', 'A finite, ordered sequence of well-defined steps that solves a specific problem', 'A flowchart with arrows', 'A random guess that sometimes works'], correct: 1, explanation: 'An algorithm is a precise, finite, ordered sequence of steps solving a specific problem.' },
        { id: 'm2q2', type: 'tf', topic: 'Finiteness', question: 'True or False: A valid algorithm may run forever as long as it eventually produces the right answer.', options: ['True', 'False'], correct: 1, explanation: 'Finiteness requires the algorithm to terminate after a limited number of steps.' },
        { id: 'm2q3', type: 'mcq', topic: 'Characteristics', question: 'Which of the following is NOT one of the five characteristics of a valid algorithm?', options: ['Finiteness', 'Definiteness', 'Popularity', 'Effectiveness'], correct: 2, explanation: 'The five characteristics are Finiteness, Definiteness, Input, Output and Effectiveness - popularity is not one of them.' },
        { id: 'm2q4', type: 'mcq', topic: 'Definiteness', question: '"Definiteness" as a characteristic of an algorithm means:', options: ['The algorithm must be written in English', 'Every step must be precisely and unambiguously defined', 'The algorithm must have exactly ten steps', 'The algorithm must never take any input'], correct: 1, explanation: 'Definiteness requires each step to have one clear, unambiguous meaning.' },
        { id: 'm2q5', type: 'mcq', topic: 'Effectiveness', question: 'The "Effectiveness" characteristic requires that each step:', options: ['Be written in a programming language', 'Be basic enough to be carried out, in principle, with pencil and paper', 'Take less than one second to run', 'Use a computer to complete'], correct: 1, explanation: 'Effectiveness means each step is simple/basic enough to actually be performed.' },
        { id: 'm2q6', type: 'mcq', topic: 'Language independence', question: 'The same algorithm for sorting a list could be implemented in Python, Java, or C. This illustrates that:', options: ['Algorithms only work in one language', 'An algorithm is an idea independent of any specific programming language', 'Sorting cannot be described as an algorithm', 'Algorithms and programs are exactly the same thing'], correct: 1, explanation: 'An algorithm is the underlying idea; code is one expression of that idea in a specific language.' },
        { id: 'm2q7', type: 'scenario', topic: 'Writing algorithms', question: 'Which instruction is precise enough to belong in a well-written algorithm?', options: ['"Handle the input somehow"', '"Add A and B, and store the result in SUM"', '"Do the usual thing with the numbers"', '"Make it work"'], correct: 1, explanation: 'This instruction is specific and unambiguous, unlike the vague alternatives.' },
        { id: 'm2q8', type: 'mcq', topic: 'Linear search', question: 'A "linear search" finds a target value by:', options: ['Repeatedly splitting the list in half', 'Checking each item in the list, one at a time, until found or the list ends', 'Sorting the list first, then guessing the middle', 'Only checking the first and last items'], correct: 1, explanation: 'Linear search checks items sequentially, one at a time.' },
        { id: 'm2q9', type: 'mcq', topic: 'Binary search', question: 'Binary search can only be used correctly when:', options: ['The list is unsorted', 'The list is already sorted', 'The list has fewer than 10 items', 'The list contains only numbers, never text'], correct: 1, explanation: 'Binary search depends on the list being sorted so that each half can be safely discarded.' },
        { id: 'm2q10', type: 'tf', topic: 'Efficiency', question: 'True or False: If two algorithms both give correct answers, they are automatically equally good.', options: ['True', 'False'], correct: 1, explanation: 'Correct algorithms can still differ in efficiency - how much work they need as input size grows.' },
        { id: 'm2q11', type: 'mcq', topic: 'Efficiency intuition', question: 'For a sorted list of 1,000 items, which search is likely to need far fewer comparisons?', options: ['Linear search', 'Binary search', 'Both need exactly the same number', 'Neither can search a sorted list'], correct: 1, explanation: 'Binary search discards half the remaining items at each step, needing far fewer comparisons for large lists.' },
        { id: 'm2q12', type: 'mcq', topic: 'Input/Output characteristic', question: 'Regarding the "Input" characteristic of an algorithm, which statement is correct?', options: ['An algorithm must always take at least one input', 'An algorithm may take zero or more well-specified inputs', 'Inputs must always be numbers', 'Inputs are optional only for sorting algorithms'], correct: 1, explanation: 'Algorithms may take zero or more well-defined inputs - some algorithms need none.' },
        { id: 'm2q13', type: 'mcq', topic: 'Output characteristic', question: 'According to the "Output" characteristic, a valid algorithm must:', options: ['Never produce any output', 'Produce one or more outputs related to the input', 'Only output the word "done"', 'Print directly to a printer'], correct: 1, explanation: 'An algorithm must produce at least one output that relates to its input(s).' },
        { id: 'm2q14', type: 'scenario', topic: 'Non-terminating logic', question: 'A set of steps includes a loop whose stopping condition can never become true. What characteristic does this violate?', options: ['Input', 'Output', 'Finiteness', 'Effectiveness'], correct: 2, explanation: 'A loop that can never stop violates Finiteness, which requires the algorithm to terminate.' },
        { id: 'm2q15', type: 'mcq', topic: 'Numbered steps', question: 'Writing an algorithm as clearly numbered steps (Start, Read, process steps, Display, Stop) mainly helps because:', options: ['It looks nicer', 'It enforces a clear, ordered, unambiguous sequence that can be followed exactly', 'Numbers are required by every programming language', 'It removes the need for testing later'], correct: 1, explanation: 'Numbered steps make the order and precision of the algorithm explicit and easy to follow.' },
        { id: 'm2q16', type: 'mcq', topic: 'Algorithm vs idea', question: '"Sort the list" is best described as:', options: ['A complete, valid algorithm', 'A general idea, not yet a precise algorithm', 'A programming language', 'An input value'], correct: 1, explanation: 'It lacks the precise, step-by-step detail required for a true algorithm.' }
      ],
      flashcards: [
        { id: 'm2f1', front: 'Algorithm', back: 'A finite, ordered sequence of well-defined steps that solves a specific problem or task.' },
        { id: 'm2f2', front: 'Finiteness', back: 'An algorithm must terminate after a finite number of steps - it cannot run forever.' },
        { id: 'm2f3', front: 'Definiteness', back: 'Every step of an algorithm must be precisely and unambiguously defined.' },
        { id: 'm2f4', front: 'Input (characteristic)', back: 'An algorithm takes zero or more well-specified inputs.' },
        { id: 'm2f5', front: 'Output (characteristic)', back: 'An algorithm produces one or more outputs related to its input(s).' },
        { id: 'm2f6', front: 'Effectiveness', back: 'Every step must be basic enough to be carried out, in principle, with pencil and paper.' },
        { id: 'm2f7', front: 'Linear search', back: 'Checking each item in a list one at a time until the target is found or the list ends.' },
        { id: 'm2f8', front: 'Binary search', back: 'Repeatedly splitting a sorted list in half to eliminate the half that cannot contain the target.' },
        { id: 'm2f9', front: 'Efficiency', back: 'A measure of how much work (time) or memory (space) an algorithm needs as input size grows.' }
      ]
    },

    {
      id: 3,
      slug: 'flowcharts',
      title: 'Flowcharts',
      icon: 'workflow',
      description: 'Turning an algorithm into a visual diagram using standard flowchart symbols, so logic can be checked at a glance.',
      objectives: [
        'Identify the standard flowchart symbols and their meanings',
        'Follow the rules for connecting flowchart symbols correctly',
        'Convert a written algorithm into a flowchart',
        'Trace a flowchart by hand to verify its logic'
      ],
      lessons: [
        {
          id: '3-1',
          title: 'Flowchart Symbols & Rules',
          intro: 'A flowchart is a picture of an algorithm. This lesson introduces the standard shapes used to draw one, and the rules that keep a flowchart readable and correct.',
          objectives: [
            'Name the standard flowchart symbols: Terminal, Input/Output, Process, Decision, Connector, Flow line',
            'Explain what each symbol represents',
            'State the basic rules for drawing a valid flowchart'
          ],
          explanation: [
            'A **flowchart** is a diagram that represents an algorithm using standardized shapes connected by arrows showing the order of execution. Because it is visual, a flowchart often makes the *shape* of the logic - especially loops and branches - easier to see at a glance than a written list of steps.',
            'The standard symbols are: the **Terminal/Oval** for Start and Stop; the **Parallelogram** for Input and Output (e.g. "Read A" or "Display SUM"); the **Rectangle** for a Process step (e.g. "SUM = A + B"); the **Diamond** for a Decision, which has exactly one way in and two ways out, usually labelled Yes/No or True/False; and the **Arrow (flow line)** connecting symbols to show the order of execution. A small **Circle** is sometimes used as a Connector when a flowchart is too large for one page.',
            'A well-formed flowchart follows some simple rules: it has exactly one Start terminal and at least one Stop terminal; every symbol (except Start) has at least one arrow coming in; every Decision diamond has exactly two arrows leaving it, one for each possible outcome; and arrows generally flow top-to-bottom or left-to-right, without unexplained crossings.'
          ],
          examples: [
            'A flowchart for "check if a number is even": Start (oval) -> Read N (parallelogram) -> N MOD 2 = 0? (diamond) -> Yes: Display "Even" (parallelogram); No: Display "Odd" (parallelogram) -> both paths merge into -> Stop (oval).'
          ],
          keyPoints: [
            'Oval = Start/Stop (Terminal). Parallelogram = Input/Output. Rectangle = Process. Diamond = Decision. Arrow = flow of control.',
            'A Decision diamond always has exactly two exits.',
            'Every flowchart needs exactly one Start and at least one Stop.',
            'Flowcharts make the shape of loops and branches easy to see visually.'
          ],
          commonMistakes: [
            'Using a rectangle for a decision instead of a diamond.',
            'Leaving a decision diamond with only one exit, or more than two.',
            'Forgetting the Stop terminal, leaving the flowchart with no defined end.',
            'Drawing arrows that do not clearly show the direction of flow.'
          ],
          practicalExample: 'For "find the larger of two numbers A and B," the flowchart is: Start -> Read A, B -> Is A > B? -> Yes: Display A; No: Display B -> Stop. Notice the Decision diamond has exactly two labeled exits, and both eventually lead to the same Stop terminal.',
          exercise: {
            prompt: 'List, in order, which flowchart symbol (Oval, Parallelogram, Rectangle, or Diamond) you would use for each of these steps: (a) "Start", (b) "Read the radius R", (c) "AREA = 3.142 * R * R", (d) "Is AREA > 100?", (e) "Display AREA".',
            guidance: 'Correct mapping: (a) Oval, (b) Parallelogram, (c) Rectangle, (d) Diamond, (e) Parallelogram.'
          }
        },
        {
          id: '3-2',
          title: 'Designing Flowcharts for Real Problems',
          intro: 'Now that you know the symbols, this lesson focuses on actually designing a flowchart from a problem statement, including flowcharts with loops.',
          objectives: [
            'Convert a written algorithm into a complete flowchart',
            'Draw a flowchart that includes a loop (repetition)',
            'Trace through a flowchart by hand to confirm it behaves correctly'
          ],
          explanation: [
            'Designing a flowchart from a problem usually follows this pattern: first identify the inputs and outputs (these become parallelograms), then identify any calculations (rectangles), then identify any decisions the logic must make (diamonds), and finally connect everything with arrows in the correct order, starting from a single Start oval and ending at a Stop oval.',
            'Loops appear in a flowchart as an arrow that flows *backward* to an earlier decision or process, rather than always moving forward. A common loop pattern is: a Decision diamond checks a condition; if the condition is still true, the flow arrow loops back up to repeat a block of steps; if the condition becomes false, the flow exits the loop and continues toward Stop.',
            '**Tracing** a flowchart means manually walking through it step by step with specific sample values, writing down the value of each variable as you go, exactly as a computer would. Tracing is one of the most reliable ways to catch a logic error before ever writing code, because it forces you to follow the diagram exactly rather than assume it works.'
          ],
          examples: [
            'A loop that adds numbers until the user enters 0: Start -> SUM = 0 -> Read NUM -> Is NUM = 0? -> Yes: Display SUM, Stop; No: SUM = SUM + NUM, then flow arrow loops back up to "Read NUM".'
          ],
          keyPoints: [
            'Identify inputs/outputs, then calculations, then decisions, before connecting the flowchart.',
            'A loop is shown as an arrow flowing backward to an earlier point in the flowchart.',
            'Tracing means manually stepping through the flowchart with sample values to verify correctness.',
            'A flowchart with a loop must still eventually reach Stop for some input - otherwise it is not finite.'
          ],
          commonMistakes: [
            'Drawing a loop with no way to ever exit it (violating finiteness).',
            'Forgetting to update the value that the loop condition depends on, causing an infinite loop.',
            'Not tracing the flowchart before assuming it is correct.'
          ],
          practicalExample: 'Tracing the "add numbers until 0" flowchart with inputs 5, 3, 0: SUM starts at 0. Read 5 -> not 0 -> SUM becomes 5 -> loop back. Read 3 -> not 0 -> SUM becomes 8 -> loop back. Read 0 -> is 0 -> Display 8, Stop. The trace confirms the flowchart correctly sums the numbers entered before the 0.',
          exercise: {
            prompt: 'Design (describe in words, symbol by symbol) a flowchart that reads a student\'s score and displays "PASS" if the score is 50 or above, or "FAIL" otherwise.',
            guidance: 'Expected shape: Start (oval) -> Read SCORE (parallelogram) -> Is SCORE >= 50? (diamond) -> Yes: Display "PASS" (parallelogram); No: Display "FAIL" (parallelogram) -> both merge -> Stop (oval).'
          }
        }
      ],
      quiz: [
        { id: 'm3q1', type: 'mcq', topic: 'Flowchart definition', question: 'A flowchart is best described as:', options: ['A written paragraph describing a program', 'A diagram representing an algorithm using standardized shapes and arrows', 'A type of programming language', 'A list of variable names'], correct: 1, explanation: 'A flowchart visually represents an algorithm using standard symbols connected by flow arrows.' },
        { id: 'm3q2', type: 'mcq', topic: 'Symbols', question: 'Which symbol is used to represent Start and Stop in a flowchart?', options: ['Rectangle', 'Diamond', 'Oval/Terminal', 'Parallelogram'], correct: 2, explanation: 'The Oval (Terminal) symbol marks the Start and Stop points.' },
        { id: 'm3q3', type: 'mcq', topic: 'Symbols', question: 'Which symbol represents an Input or Output operation, such as "Read A" or "Display SUM"?', options: ['Parallelogram', 'Diamond', 'Rectangle', 'Circle'], correct: 0, explanation: 'The Parallelogram is used for Input/Output operations.' },
        { id: 'm3q4', type: 'mcq', topic: 'Symbols', question: 'Which symbol represents a Process step, such as "SUM = A + B"?', options: ['Oval', 'Rectangle', 'Diamond', 'Parallelogram'], correct: 1, explanation: 'The Rectangle represents a processing/calculation step.' },
        { id: 'm3q5', type: 'mcq', topic: 'Decision diamond', question: 'How many arrows should leave a properly drawn Decision diamond?', options: ['One', 'Exactly two', 'Three or more', 'Zero'], correct: 1, explanation: 'A decision has exactly two possible outcomes, so exactly two exit arrows.' },
        { id: 'm3q6', type: 'tf', topic: 'Terminals', question: 'True or False: A valid flowchart may have more than one Start terminal.', options: ['True', 'False'], correct: 1, explanation: 'A flowchart should have exactly one Start terminal, though it may have more than one Stop.' },
        { id: 'm3q7', type: 'scenario', topic: 'Choosing symbols', question: 'Which shape should be used for the step "Is AGE >= 18?"', options: ['Rectangle', 'Parallelogram', 'Diamond', 'Oval'], correct: 2, explanation: 'This is a decision/comparison, so it belongs in a Diamond.' },
        { id: 'm3q8', type: 'mcq', topic: 'Flow lines', question: 'Arrows (flow lines) in a flowchart primarily indicate:', options: ['Which symbol is largest', 'The order in which steps are executed', 'The programming language used', 'How many variables exist'], correct: 1, explanation: 'Flow lines show the direction and order of execution.' },
        { id: 'm3q9', type: 'mcq', topic: 'Loops in flowcharts', question: 'A loop in a flowchart is typically shown as:', options: ['A diamond with only one exit', 'An arrow flowing backward to an earlier point in the diagram', 'A second Start terminal', 'A rectangle with no arrows'], correct: 1, explanation: 'Loops appear as a backward-flowing arrow that repeats an earlier part of the flowchart.' },
        { id: 'm3q10', type: 'mcq', topic: 'Infinite loops', question: 'What is the danger of a loop whose exit condition can never become true?', options: ['The flowchart becomes more colorful', 'The flowchart would never terminate, violating finiteness', 'The flowchart runs faster', 'There is no danger'], correct: 1, explanation: 'A loop that can never exit violates the finiteness requirement of a valid algorithm.' },
        { id: 'm3q11', type: 'mcq', topic: 'Tracing', question: '"Tracing" a flowchart means:', options: ['Copying it onto a new page', 'Manually stepping through it with sample values to verify correctness', 'Deleting unnecessary symbols', 'Converting it directly into machine code'], correct: 1, explanation: 'Tracing means manually following the flowchart step by step with real values.' },
        { id: 'm3q12', type: 'mcq', topic: 'Design order', question: 'When designing a flowchart from a problem statement, which is the most sensible order?', options: ['Draw Stop first, then work backward randomly', 'Identify inputs/outputs, then calculations, then decisions, then connect them', 'Draw arrows first, then decide what they connect', 'Start with the Decision diamonds only'], correct: 1, explanation: 'A sensible design order identifies inputs/outputs and processes before wiring up decisions and connections.' },
        { id: 'm3q13', type: 'scenario', topic: 'Debugging a flowchart', question: 'While tracing a flowchart meant to sum numbers until a 0 is entered, you notice SUM never changes after the first pass. What is the most likely cause?', options: ['The Stop terminal is in the wrong place', 'The process step that updates SUM was left out of the loop, or the loop never returns to it', 'The flowchart has too many arrows', 'The Oval symbol was used for Start'], correct: 1, explanation: 'If SUM never updates, the update step is likely missing from the loop or the flow never reaches it.' },
        { id: 'm3q14', type: 'mcq', topic: 'Connector symbol', question: 'The small circle symbol in a flowchart is typically used as a:', options: ['Decision point', 'Connector, linking parts of a flowchart across pages or sections', 'Replacement for Start', 'Loop counter'], correct: 1, explanation: 'The circle is used as a connector when a flowchart is too large to fit cleanly on one page.' },
        { id: 'm3q15', type: 'mcq', topic: 'Why use flowcharts', question: 'A key benefit of drawing a flowchart, compared to only writing an algorithm as text, is that:', options: ['It removes the need to test the logic', 'It can make the shape of branches and loops easier to see at a glance', 'It is always faster to draw than to write', 'It replaces the need for pseudocode entirely'], correct: 1, explanation: 'The visual layout of a flowchart often reveals the structure of branches and loops more clearly than plain text.' },
        { id: 'm3q16', type: 'mcq', topic: 'Merging branches', question: 'In a flowchart where a Decision diamond has a Yes and a No branch that both lead to the same next step, what usually happens to the two arrows?', options: ['They must never be drawn again', 'They can merge back together before continuing to the shared next step', 'One of them must lead to a different Stop', 'They are deleted'], correct: 1, explanation: 'Both branches can converge back into the shared next step before the flowchart continues.' }
      ],
      flashcards: [
        { id: 'm3f1', front: 'Flowchart', back: 'A diagram representing an algorithm using standardized shapes connected by arrows showing order of execution.' },
        { id: 'm3f2', front: 'Terminal (Oval)', back: 'Marks the Start or Stop point of a flowchart.' },
        { id: 'm3f3', front: 'Parallelogram', back: 'Represents an Input or Output operation, e.g. "Read A" or "Display SUM".' },
        { id: 'm3f4', front: 'Rectangle (Process)', back: 'Represents a calculation or processing step, e.g. "SUM = A + B".' },
        { id: 'm3f5', front: 'Diamond (Decision)', back: 'Represents a decision point; has exactly one entry and exactly two exits (e.g. Yes/No).' },
        { id: 'm3f6', front: 'Flow line (arrow)', back: 'Shows the direction and order in which steps are executed.' },
        { id: 'm3f7', front: 'Connector', back: 'A small circle used to link parts of a flowchart, often across pages.' },
        { id: 'm3f8', front: 'Loop in a flowchart', back: 'An arrow that flows backward to an earlier point, causing steps to repeat until a condition changes.' },
        { id: 'm3f9', front: 'Tracing a flowchart', back: 'Manually stepping through the flowchart with sample values to check its logic is correct.' }
      ]
    },

    {
      id: 4,
      slug: 'pseudocode',
      title: 'Pseudocode',
      icon: 'terminal',
      description: 'Writing algorithm logic in structured, language-like text - the bridge between a flowchart and real program code.',
      objectives: [
        'Explain what pseudocode is and why it is used',
        'Follow common pseudocode conventions and keywords',
        'Convert a flowchart or algorithm into pseudocode',
        'Read and trace pseudocode to determine its output'
      ],
      lessons: [
        {
          id: '4-1',
          title: 'Writing Pseudocode',
          intro: 'Pseudocode expresses an algorithm in structured, plain language that reads almost like code but is not tied to any specific programming language. This lesson introduces its purpose and basic form.',
          objectives: [
            'Define pseudocode and explain why it is useful',
            'Use common pseudocode keywords: START, READ/INPUT, WRITE/OUTPUT/DISPLAY, SET, STOP',
            'Write simple sequential pseudocode for a small problem'
          ],
          explanation: [
            '**Pseudocode** is a way of describing an algorithm using structured, plain-language statements that resemble programming code without following the strict syntax of any real language. It sits between a flowchart (visual) and actual source code (strict syntax): more precise than plain English, but more flexible than any one programming language.',
            'Pseudocode is useful because it lets you focus entirely on the *logic* of a solution without worrying about semicolons, brackets, or a compiler rejecting your syntax. It is also language-independent, so a pseudocode solution can later be translated into Python, Java, C, or any other language.',
            'Common conventions used in this course: **START/STOP** mark the beginning and end. **READ** or **INPUT** takes in a value (e.g. "READ AGE"). **WRITE**, **OUTPUT**, or **DISPLAY** produce a result (e.g. "DISPLAY SUM"). **SET** or the assignment symbol **<-** stores a value in a variable (e.g. "SET TOTAL <- A + B"). Indentation is used to show which statements belong inside a decision or loop.'
          ],
          examples: [
            'Pseudocode to add two numbers:\nSTART\n  READ A, B\n  SET SUM <- A + B\n  DISPLAY SUM\nSTOP'
          ],
          keyPoints: [
            'Pseudocode is structured, language-independent text that describes an algorithm\'s logic.',
            'It sits between plain English (too vague) and real code (too strict) in terms of precision.',
            'Common keywords: START, STOP, READ/INPUT, WRITE/DISPLAY/OUTPUT, SET (assignment).',
            'Indentation shows which lines belong to a decision or loop.'
          ],
          commonMistakes: [
            'Writing pseudocode as vague prose ("figure out the total") instead of precise steps.',
            'Mixing in real programming-language syntax (like semicolons or curly braces) unnecessarily.',
            'Forgetting to show indentation for steps that belong inside a decision or loop.'
          ],
          practicalExample: 'Converting the flowchart for "check if a number is even" into pseudocode:\nSTART\n  READ N\n  SET REMAINDER <- N MOD 2\n  IF REMAINDER = 0 THEN\n    DISPLAY "Even"\n  ELSE\n    DISPLAY "Odd"\n  ENDIF\nSTOP',
          exercise: {
            prompt: 'Write pseudocode that reads the length and width of a rectangle and displays its area.',
            guidance: 'Expected shape: START, READ LENGTH, WIDTH, SET AREA <- LENGTH * WIDTH, DISPLAY AREA, STOP.'
          }
        },
        {
          id: '4-2',
          title: 'Pseudocode Conventions & Practice',
          intro: 'This lesson covers pseudocode for decisions and loops, and gives you practice tracing pseudocode by hand to find its output.',
          objectives: [
            'Write pseudocode using IF/ELSE/ENDIF for decisions',
            'Write pseudocode using WHILE or FOR for repetition',
            'Trace pseudocode by hand to determine its final output'
          ],
          explanation: [
            'Decisions in pseudocode use **IF ... THEN ... ELSE ... ENDIF**. The THEN branch runs when the condition is true; the ELSE branch (optional) runs when it is false. Multiple conditions can be chained with **ELSE IF**.',
            'Repetition in pseudocode commonly uses **WHILE ... ENDWHILE** (repeats as long as a condition stays true, checked before each pass) or **FOR ... ENDFOR** (repeats a known number of times, using a counter). A WHILE loop needs something inside it that can eventually make the condition false, or it will never stop - exactly the finiteness issue discussed in the Algorithms module.',
            'Tracing pseudocode means running it "in your head" (or on paper) with specific values, updating a small table of variable values line by line, exactly as a computer would execute it. This is the most reliable way to predict pseudocode\'s output before ever typing it into a real programming language.'
          ],
          examples: [
            'Pseudocode using WHILE to sum numbers until 0 is entered:\nSTART\n  SET SUM <- 0\n  READ NUM\n  WHILE NUM <> 0\n    SET SUM <- SUM + NUM\n    READ NUM\n  ENDWHILE\n  DISPLAY SUM\nSTOP'
          ],
          keyPoints: [
            'IF / THEN / ELSE / ENDIF expresses a decision; ELSE IF chains multiple conditions.',
            'WHILE / ENDWHILE repeats while a condition remains true; FOR / ENDFOR repeats a known number of times.',
            'A WHILE loop must contain something that can eventually make its condition false.',
            'Tracing means executing pseudocode by hand, line by line, tracking variable values.'
          ],
          commonMistakes: [
            'Writing a WHILE loop where the condition variable is never updated inside the loop.',
            'Forgetting ENDIF or ENDWHILE, leaving it unclear where a block of statements ends.',
            'Skipping the trace step and assuming pseudocode is correct just because it "looks right."'
          ],
          practicalExample: 'Tracing this pseudocode with N = 5:\nSTART\n  READ N\n  SET COUNT <- 1\n  WHILE COUNT <= N\n    DISPLAY COUNT\n    SET COUNT <- COUNT + 1\n  ENDWHILE\nSTOP\nTrace: COUNT=1 (display 1, COUNT becomes 2), COUNT=2 (display 2, becomes 3)... continues until COUNT=6, where 6<=5 is false, so the loop ends. Output: 1 2 3 4 5.',
          exercise: {
            prompt: 'Trace this pseudocode by hand and state its final output: SET X <- 10; WHILE X > 0; DISPLAY X; SET X <- X - 3; ENDWHILE.',
            guidance: 'The values displayed are 10, 7, 4, 1 - after that X becomes -2, and since -2 > 0 is false, the loop stops. The full output sequence is: 10 7 4 1.'
          }
        }
      ],
      quiz: [
        { id: 'm4q1', type: 'mcq', topic: 'Pseudocode definition', question: 'Pseudocode is best described as:', options: ['A real programming language with strict syntax', 'Structured, language-independent text describing an algorithm\'s logic', 'A type of flowchart symbol', 'Machine code'], correct: 1, explanation: 'Pseudocode describes logic in a structured, plain-language way, independent of any specific language.' },
        { id: 'm4q2', type: 'mcq', topic: 'Why pseudocode', question: 'One key benefit of pseudocode is that it:', options: ['Requires a compiler to check it', 'Lets you focus on logic without worrying about strict language syntax', 'Can only be used for loops', 'Must always be converted to a flowchart first'], correct: 1, explanation: 'Pseudocode removes the burden of exact syntax so the writer can focus purely on logic.' },
        { id: 'm4q3', type: 'mcq', topic: 'Keywords', question: 'Which keyword pair is commonly used to mark the beginning and end of pseudocode?', options: ['BEGIN / FINISH', 'START / STOP', 'OPEN / CLOSE', 'LOAD / SAVE'], correct: 1, explanation: 'START and STOP are the conventional markers for the beginning and end.' },
        { id: 'm4q4', type: 'mcq', topic: 'Assignment', question: 'In pseudocode, "SET TOTAL <- A + B" means:', options: ['Compare TOTAL to A + B', 'Store the result of A + B into the variable TOTAL', 'Display the value of TOTAL', 'Delete the variable TOTAL'], correct: 1, explanation: 'The <- symbol is an assignment - it stores a computed value into a variable.' },
        { id: 'm4q5', type: 'mcq', topic: 'Decision syntax', question: 'Which pseudocode structure is used to express a decision?', options: ['WHILE / ENDWHILE', 'FOR / ENDFOR', 'IF / THEN / ELSE / ENDIF', 'READ / WRITE'], correct: 2, explanation: 'IF/THEN/ELSE/ENDIF is the standard structure for decisions.' },
        { id: 'm4q6', type: 'mcq', topic: 'Loop syntax', question: 'Which pseudocode structure repeats a block of statements while a condition remains true?', options: ['IF / ENDIF', 'WHILE / ENDWHILE', 'READ / STOP', 'DISPLAY / ENDDISPLAY'], correct: 1, explanation: 'WHILE/ENDWHILE repeats while its condition stays true.' },
        { id: 'm4q7', type: 'tf', topic: 'Infinite loops', question: 'True or False: A WHILE loop is guaranteed to stop even if the condition variable is never changed inside the loop.', options: ['True', 'False'], correct: 1, explanation: 'If the condition variable never changes, the loop can run forever - it is not guaranteed to stop.' },
        { id: 'm4q8', type: 'scenario', topic: 'Tracing', question: 'Given: SET X <- 3; WHILE X < 6; DISPLAY X; SET X <- X + 1; ENDWHILE - what is displayed?', options: ['3 4 5', '3 4 5 6', '6', 'Nothing'], correct: 0, explanation: 'X takes values 3, 4, 5 inside the loop (each displayed), then becomes 6, at which point 6 < 6 is false and the loop stops.' },
        { id: 'm4q9', type: 'scenario', topic: 'Tracing decisions', question: 'Given: READ SCORE; IF SCORE >= 50 THEN DISPLAY "PASS" ELSE DISPLAY "FAIL" ENDIF - what is displayed if SCORE is 50?', options: ['PASS', 'FAIL', 'Nothing, because 50 is a boundary value', 'Both PASS and FAIL'], correct: 0, explanation: 'Since 50 >= 50 is true, the THEN branch runs and "PASS" is displayed.' },
        { id: 'm4q10', type: 'mcq', topic: 'Chaining conditions', question: 'To check several conditions in sequence within an IF statement, pseudocode typically uses:', options: ['ELSE IF', 'STOP IF', 'WHILE IF', 'FOR EACH'], correct: 0, explanation: 'ELSE IF chains additional conditions after the first IF.' },
        { id: 'm4q11', type: 'mcq', topic: 'FOR loops', question: 'A FOR loop is generally the best choice when:', options: ['The number of repetitions is already known in advance', 'You never want the loop to run', 'The condition can never be evaluated', 'You need to display text only once'], correct: 0, explanation: 'FOR loops suit situations where the number of repetitions is known ahead of time.' },
        { id: 'm4q12', type: 'mcq', topic: 'Indentation', question: 'In pseudocode, indentation is mainly used to:', options: ['Make the pseudocode compile faster', 'Show which statements belong inside a decision or loop block', 'Replace the need for READ and WRITE', 'Indicate a comment'], correct: 1, explanation: 'Indentation visually groups statements that belong to a particular block, like an IF or WHILE.' },
        { id: 'm4q13', type: 'mcq', topic: 'READ/DISPLAY', question: 'Which keyword pair matches "take in a value" and "produce a result" respectively?', options: ['DISPLAY and READ', 'READ (or INPUT) and DISPLAY (or WRITE/OUTPUT)', 'STOP and START', 'SET and IF'], correct: 1, explanation: 'READ/INPUT takes in values; DISPLAY/WRITE/OUTPUT produces results.' },
        { id: 'm4q14', type: 'scenario', topic: 'Debugging pseudocode', question: 'A WHILE loop meant to count down from 5 to 1 never stops. What is the most likely bug?', options: ['DISPLAY was spelled correctly', 'The counter variable is never decreased inside the loop', 'The loop used FOR instead of WHILE', 'STOP appears at the end'], correct: 1, explanation: 'If the counter never changes, the WHILE condition never becomes false, so the loop never ends.' },
        { id: 'm4q15', type: 'mcq', topic: 'Pseudocode vs flowchart', question: 'Compared to a flowchart, pseudocode is generally:', options: ['Purely visual with no text', 'Text-based, and often faster to write for complex logic', 'Only usable for loops', 'A completely different, unrelated concept'], correct: 1, explanation: 'Pseudocode expresses the same logic as a flowchart but in text form, which many find faster to write for complex logic.' },
        { id: 'm4q16', type: 'mcq', topic: 'Language independence', question: 'Why is pseudocode considered language-independent?', options: ['It must be written in English only', 'It is not tied to the exact syntax rules of any specific programming language', 'It cannot be translated into real code', 'It only works with Python'], correct: 1, explanation: 'Pseudocode describes logic without following any specific language\'s strict syntax rules, so it can be translated into many languages.' }
      ],
      flashcards: [
        { id: 'm4f1', front: 'Pseudocode', back: 'Structured, language-independent text that describes an algorithm\'s logic, resembling code without strict syntax rules.' },
        { id: 'm4f2', front: 'START / STOP', back: 'Pseudocode keywords marking the beginning and end of the algorithm.' },
        { id: 'm4f3', front: 'READ / INPUT', back: 'Pseudocode keyword for taking in a value, e.g. READ AGE.' },
        { id: 'm4f4', front: 'DISPLAY / WRITE / OUTPUT', back: 'Pseudocode keyword for producing a result, e.g. DISPLAY SUM.' },
        { id: 'm4f5', front: 'SET / <- (assignment)', back: 'Stores a computed value into a variable, e.g. SET TOTAL <- A + B.' },
        { id: 'm4f6', front: 'IF / THEN / ELSE / ENDIF', back: 'Pseudocode structure expressing a decision between two (or more, with ELSE IF) branches.' },
        { id: 'm4f7', front: 'WHILE / ENDWHILE', back: 'Repeats a block of statements while a condition remains true, checked before each pass.' },
        { id: 'm4f8', front: 'FOR / ENDFOR', back: 'Repeats a block of statements a known number of times using a counter.' },
        { id: 'm4f9', front: 'Tracing pseudocode', back: 'Manually executing pseudocode line by line with sample values to determine its output.' }
      ]
    },

    {
      id: 5,
      slug: 'data-variables',
      title: 'Data, Variables & Operators',
      icon: 'database',
      description: 'The building blocks every algorithm manipulates: data types, variables, constants, and the operators that combine them.',
      objectives: [
        'Identify common data types: integer, real/float, character, string, boolean',
        'Explain the difference between a variable and a constant',
        'Use arithmetic, relational, and logical operators correctly',
        'Evaluate an expression using operator precedence'
      ],
      lessons: [
        {
          id: '5-1',
          title: 'Data Types & Variables',
          intro: 'Every algorithm works with data of some kind. This lesson covers the basic data types and how variables store and label that data.',
          objectives: [
            'Name and describe the common basic data types',
            'Define "variable" and "constant" and explain the difference',
            'Choose an appropriate data type for a given value'
          ],
          explanation: [
            'A **data type** classifies the kind of value being stored and what operations make sense on it. The common basic data types are: **Integer** - whole numbers with no decimal part (e.g. 7, -3, 0); **Real/Float** - numbers that may have a decimal part (e.g. 3.142, -0.5); **Character** - a single symbol, letter, or digit stored as text (e.g. \'A\'); **String** - a sequence of characters (e.g. "Lapai"); and **Boolean** - a value that is only ever True or False.',
            'A **variable** is a named storage location whose value can change while an algorithm runs - it is a label attached to a piece of memory. A **constant** is a named value that is fixed and does not change during execution, such as PI = 3.142. Using named variables and constants, instead of unexplained raw numbers, makes an algorithm far easier to read and to modify later.',
            'Choosing the right data type matters: storing a matriculation number (which may contain letters, and is never used in arithmetic) as a String makes more sense than as an Integer, while a student\'s current CGPA clearly needs a Real/Float type since it has a decimal part.'
          ],
          examples: [
            'AGE (Integer) = 20\nCGPA (Real) = 4.35\nGRADE (Character) = \'A\'\nNAME (String) = "Amina"\nIS_REGISTERED (Boolean) = True\nPI (Constant, Real) = 3.142'
          ],
          keyPoints: [
            'Basic data types: Integer, Real/Float, Character, String, Boolean.',
            'A variable\'s value can change while the algorithm runs; a constant\'s value cannot.',
            'Choosing the right data type depends on the nature of the value and what will be done with it.',
            'Named variables/constants make an algorithm far more readable than unexplained raw numbers.'
          ],
          commonMistakes: [
            'Storing numeric-looking data that is never used in arithmetic (like a phone number) as an Integer instead of a String.',
            'Using a Real/Float type for something that should always be a whole number (like a count of students).',
            'Treating a constant as if its value could change during the algorithm.'
          ],
          practicalExample: 'For a student record, MATRIC_NO should be a String (it may include letters/slashes and is never added or multiplied), UNITS_REGISTERED should be an Integer (a whole count), and CGPA should be a Real (it has a decimal part).',
          exercise: {
            prompt: 'For each of these values, state the most appropriate data type: (a) number of siblings, (b) a course code like "COS102", (c) average temperature for the week, (d) whether a student has paid fees.',
            guidance: 'Expected answers: (a) Integer, (b) String, (c) Real/Float, (d) Boolean.'
          }
        },
        {
          id: '5-2',
          title: 'Operators & Expressions',
          intro: 'Operators combine values into new results. This lesson covers arithmetic, relational, and logical operators, plus the order in which they are evaluated.',
          objectives: [
            'List common arithmetic, relational, and logical operators',
            'Explain operator precedence (order of evaluation)',
            'Evaluate a multi-operator expression by hand'
          ],
          explanation: [
            '**Arithmetic operators** perform calculations: + (addition), - (subtraction), * (multiplication), / (division), and MOD (remainder after division, e.g. 7 MOD 2 = 1). **Relational operators** compare two values and produce a Boolean result: = (equal to), <> or != (not equal to), > (greater than), < (less than), >= (greater than or equal to), <= (less than or equal to). **Logical operators** combine Boolean values: AND (true only if both sides are true), OR (true if at least one side is true), and NOT (reverses a Boolean value).',
            '**Operator precedence** determines the order operations are evaluated when an expression mixes several operators. A common precedence order (highest to lowest) is: parentheses first, then multiplication/division/MOD, then addition/subtraction, then relational operators, then logical operators (NOT before AND before OR). When in doubt, parentheses can always be added to force a specific order and make the expression easier to read.',
            'Getting precedence wrong is a very common source of logic errors. For example, "A + B * C" is not the same as "(A + B) * C" - multiplication happens before addition unless parentheses say otherwise.'
          ],
          examples: [
            'Evaluate 2 + 3 * 4: multiplication happens first (3*4=12), then addition (2+12=14). Result: 14, NOT 20.',
            'Evaluate (2 + 3) * 4: the parentheses force addition first (2+3=5), then multiplication (5*4=20). Result: 20.',
            'Evaluate 10 MOD 3: 10 divided by 3 is 3 remainder 1, so 10 MOD 3 = 1.'
          ],
          keyPoints: [
            'Arithmetic operators: +, -, *, /, MOD (remainder).',
            'Relational operators: =, <>, >, <, >=, <= - each produces a Boolean result.',
            'Logical operators: AND, OR, NOT - combine or invert Boolean values.',
            'Precedence order (typical): parentheses, then * / MOD, then + -, then relational, then logical (NOT, AND, OR).'
          ],
          commonMistakes: [
            'Assuming operators are evaluated strictly left to right, ignoring precedence.',
            'Confusing = (comparison, in pseudocode) with assignment - some notations use <- for assignment specifically to avoid this confusion.',
            'Forgetting that MOD gives the remainder, not the quotient.'
          ],
          practicalExample: 'Determining if a year Y is divisible by 4 uses the expression (Y MOD 4 = 0). MOD is evaluated first (giving the remainder of Y divided by 4), and only then is the result compared to 0 using the relational operator =.',
          exercise: {
            prompt: 'Evaluate this expression by hand, showing the order of operations: 5 + 6 / 2 - 1 * 3.',
            guidance: 'Division and multiplication happen before addition/subtraction, left to right: 6/2=3, 1*3=3. Expression becomes 5 + 3 - 3 = 5.'
          }
        }
      ],
      quiz: [
        { id: 'm5q1', type: 'mcq', topic: 'Data types', question: 'Which data type would best store the value 3.142?', options: ['Integer', 'Real/Float', 'Character', 'Boolean'], correct: 1, explanation: '3.142 has a decimal part, so Real/Float is appropriate.' },
        { id: 'm5q2', type: 'mcq', topic: 'Data types', question: 'Which data type only ever holds True or False?', options: ['String', 'Boolean', 'Character', 'Real'], correct: 1, explanation: 'Boolean is the data type restricted to True/False values.' },
        { id: 'm5q3', type: 'mcq', topic: 'Variable vs constant', question: 'The key difference between a variable and a constant is:', options: ['Variables can only store numbers; constants can store any type', 'A variable\'s value can change while the algorithm runs; a constant\'s value cannot', 'Constants are always Boolean', 'There is no difference'], correct: 1, explanation: 'A variable is changeable during execution; a constant stays fixed.' },
        { id: 'm5q4', type: 'scenario', topic: 'Choosing data types', question: 'Which data type is most appropriate for a matriculation number like "CSC/2021/045"?', options: ['Integer', 'Real', 'String', 'Boolean'], correct: 2, explanation: 'It contains letters and symbols and is never used in arithmetic, so String is appropriate.' },
        { id: 'm5q5', type: 'mcq', topic: 'Arithmetic operators', question: 'Which operator returns the remainder after division?', options: ['/', '*', 'MOD', '-'], correct: 2, explanation: 'MOD returns the remainder of a division, e.g. 7 MOD 2 = 1.' },
        { id: 'm5q6', type: 'mcq', topic: 'Relational operators', question: 'Which of these is a relational operator?', options: ['AND', '>=', 'MOD', 'SET'], correct: 1, explanation: '>= (greater than or equal to) is a relational operator, producing a Boolean result.' },
        { id: 'm5q7', type: 'mcq', topic: 'Logical operators', question: 'The logical operator AND produces True only when:', options: ['At least one side is True', 'Both sides are True', 'Neither side is True', 'Exactly one side is True'], correct: 1, explanation: 'AND is True only when both operands are True.' },
        { id: 'm5q8', type: 'mcq', topic: 'Logical operators', question: 'The logical operator OR produces True when:', options: ['Both sides are False', 'At least one side is True', 'Neither side is evaluated', 'Only when both sides are True'], correct: 1, explanation: 'OR is True if at least one operand is True.' },
        { id: 'm5q9', type: 'scenario', topic: 'Precedence', question: 'What is the result of the expression 2 + 3 * 4?', options: ['20', '14', '24', '9'], correct: 1, explanation: 'Multiplication happens before addition: 3*4=12, then 2+12=14.' },
        { id: 'm5q10', type: 'scenario', topic: 'Precedence with parentheses', question: 'What is the result of (2 + 3) * 4?', options: ['14', '20', '9', '24'], correct: 1, explanation: 'Parentheses force the addition first: 2+3=5, then 5*4=20.' },
        { id: 'm5q11', type: 'mcq', topic: 'MOD operator', question: 'What is the result of 10 MOD 3?', options: ['3', '1', '3.33', '0'], correct: 1, explanation: '10 divided by 3 is 3 remainder 1, so 10 MOD 3 = 1.' },
        { id: 'm5q12', type: 'mcq', topic: 'Precedence order', question: 'In typical precedence order, which group is evaluated first (outside of parentheses)?', options: ['Logical operators (AND/OR)', 'Relational operators (>, <, =)', 'Multiplication, division, and MOD', 'It is always left to right regardless of operator'], correct: 2, explanation: 'Multiplication/division/MOD is evaluated before addition/subtraction, relational, and logical operators.' },
        { id: 'm5q13', type: 'tf', topic: 'Left-to-right myth', question: 'True or False: Expressions with mixed operators are always evaluated strictly left to right, ignoring operator type.', options: ['True', 'False'], correct: 1, explanation: 'Precedence rules, not just left-to-right order, determine evaluation order.' },
        { id: 'm5q14', type: 'mcq', topic: 'NOT operator', question: 'The logical operator NOT does what to a Boolean value?', options: ['Doubles it', 'Reverses it (True becomes False and vice versa)', 'Adds 1 to it', 'Leaves it unchanged'], correct: 1, explanation: 'NOT inverts a Boolean value.' },
        { id: 'm5q15', type: 'scenario', topic: 'Leap year expression', question: 'Which expression correctly checks if a year Y is evenly divisible by 4?', options: ['Y / 4 = 0', 'Y MOD 4 = 0', 'Y * 4 = 0', 'Y - 4 = 0'], correct: 1, explanation: 'MOD gives the remainder; a remainder of 0 means the year is evenly divisible by 4.' },
        { id: 'm5q16', type: 'mcq', topic: 'Readability', question: 'Why is it good practice to use named constants (e.g. PI = 3.142) instead of writing raw numbers directly in an algorithm?', options: ['It makes the algorithm run faster', 'It makes the algorithm easier to read and to update later', 'Raw numbers are not allowed in pseudocode', 'It changes the data type automatically'], correct: 1, explanation: 'Named constants improve readability and make future changes easier.' }
      ],
      flashcards: [
        { id: 'm5f1', front: 'Data type', back: 'Classifies the kind of value being stored and what operations make sense on it (e.g. Integer, Real, String).' },
        { id: 'm5f2', front: 'Integer', back: 'A whole number data type with no decimal part, e.g. 7, -3, 0.' },
        { id: 'm5f3', front: 'Real / Float', back: 'A numeric data type that may include a decimal part, e.g. 3.142.' },
        { id: 'm5f4', front: 'Boolean', back: 'A data type restricted to only True or False.' },
        { id: 'm5f5', front: 'Variable', back: 'A named storage location whose value can change while an algorithm runs.' },
        { id: 'm5f6', front: 'Constant', back: 'A named value that stays fixed and does not change during execution.' },
        { id: 'm5f7', front: 'MOD operator', back: 'Returns the remainder after division, e.g. 7 MOD 2 = 1.' },
        { id: 'm5f8', front: 'Relational operator', back: 'Compares two values and produces a Boolean result, e.g. >, <, =, >=, <=, <>.' },
        { id: 'm5f9', front: 'Operator precedence', back: 'The order in which operators are evaluated: parentheses, then * / MOD, then + -, then relational, then logical.' }
      ]
    },

    {
      id: 6,
      slug: 'control-structures',
      title: 'Control Structures',
      icon: 'git-branch',
      description: 'How an algorithm chooses between paths (selection) and repeats work (repetition) - the two structures that turn a straight-line list of steps into real logic.',
      objectives: [
        'Explain sequence, selection, and repetition as the three basic control structures',
        'Design and trace a selection structure (IF/ELSE, nested IF, multi-way selection)',
        'Design and trace repetition structures (WHILE, FOR, DO...WHILE)',
        'Choose the right control structure for a given problem'
      ],
      lessons: [
        {
          id: '6-1',
          title: 'Selection Structures',
          intro: 'Real problems rarely follow one straight path. Selection structures let an algorithm choose which steps to run based on a condition.',
          objectives: [
            'Define selection (branching) as a control structure',
            'Write single, double, and multi-way selection logic',
            'Correctly nest one selection inside another'
          ],
          explanation: [
            'There are three basic **control structures** that every algorithm is built from: **Sequence** (steps run one after another, in order), **Selection** (the algorithm chooses between two or more paths based on a condition), and **Repetition** (a block of steps runs multiple times). This lesson focuses on Selection.',
            '**Single selection** (IF...THEN) runs a block only when a condition is true, and simply skips it otherwise. **Double selection** (IF...THEN...ELSE) always runs exactly one of two blocks - the THEN block if the condition is true, the ELSE block if it is false. **Multi-way selection** (IF...ELSE IF...ELSE IF...ELSE) chooses among several possible paths by checking conditions in order, running the first block whose condition is true.',
            '**Nested selection** means placing one IF structure entirely inside another. This is useful when a decision only makes sense after another decision has already been made - for example, first checking if a student passed, and only then, within the "passed" branch, checking which grade band they fall into.'
          ],
          examples: [
            'Multi-way selection for grading:\nIF SCORE >= 70 THEN\n  DISPLAY "A"\nELSE IF SCORE >= 60 THEN\n  DISPLAY "B"\nELSE IF SCORE >= 50 THEN\n  DISPLAY "C"\nELSE\n  DISPLAY "F"\nENDIF'
          ],
          keyPoints: [
            'The three basic control structures are Sequence, Selection, and Repetition.',
            'Single selection (IF) runs a block conditionally; double selection (IF/ELSE) always runs exactly one of two blocks.',
            'Multi-way selection (IF/ELSE IF/ELSE) checks conditions in order and runs the first matching block.',
            'Nested selection places one IF structure inside another for decisions that depend on a prior decision.'
          ],
          commonMistakes: [
            'Using several separate IF statements when a single IF/ELSE IF/ELSE chain would be clearer and avoid unnecessary checks.',
            'Placing conditions in the wrong order in a multi-way selection, so an earlier condition wrongly catches cases meant for a later one.',
            'Forgetting to close nested IF blocks with matching ENDIFs, making the structure ambiguous.'
          ],
          practicalExample: 'For grading, checking ">= 70" before ">= 60" matters: if the order were reversed and score is 75, the ">= 60" branch would wrongly catch it before the ">= 70" branch ever got a chance, because a chain stops at the first TRUE condition it finds.',
          exercise: {
            prompt: 'Write multi-way selection pseudocode that classifies a BMI value: below 18.5 = "Underweight", 18.5 up to 25 = "Normal", 25 up to 30 = "Overweight", 30 and above = "Obese".',
            guidance: 'Check conditions from one extreme to the other in order, e.g. starting with BMI < 18.5, then ELSE IF BMI < 25, then ELSE IF BMI < 30, then a final ELSE for Obese - this way each condition only needs to check one boundary because earlier ranges have already been ruled out.'
          }
        },
        {
          id: '6-2',
          title: 'Repetition (Loop) Structures',
          intro: 'Repetition lets an algorithm repeat a block of steps without writing them out multiple times. This lesson covers the main loop types and when to use each.',
          objectives: [
            'Explain repetition as a control structure',
            'Distinguish pre-test loops (WHILE, FOR) from post-test loops (DO...WHILE/REPEAT...UNTIL)',
            'Choose the correct loop type for a given problem and trace it correctly'
          ],
          explanation: [
            'A **pre-test loop** checks its condition *before* each pass, so its body may run zero times if the condition is false from the start. **WHILE...ENDWHILE** is the classic pre-test loop, used when the number of repetitions is not known in advance. **FOR...ENDFOR** is also a pre-test loop, but is used specifically when the number of repetitions is known ahead of time, driven by a counter (e.g. "FOR I <- 1 TO 10").',
            'A **post-test loop** checks its condition *after* each pass, so its body always runs at least once, even if the condition would have been false to start with. **DO...WHILE** (or **REPEAT...UNTIL**, depending on notation) is the standard post-test loop. This matters, for example, in a menu system that must always show the menu at least once, before checking whether the user wants to exit.',
            'Choosing the right loop is about matching the structure to the problem: use FOR when you know exactly how many times to repeat; use WHILE when repetition depends on a condition that might be false immediately; use DO...WHILE/REPEAT...UNTIL when the body must run at least once regardless.'
          ],
          examples: [
            'FOR loop that displays 1 to 5:\nFOR I <- 1 TO 5\n  DISPLAY I\nENDFOR',
            'DO...WHILE loop that always runs at least once:\nDO\n  READ CHOICE\n  DISPLAY "You chose: " + CHOICE\nWHILE CHOICE <> "EXIT"'
          ],
          keyPoints: [
            'Pre-test loops (WHILE, FOR) check the condition before each pass and may run zero times.',
            'Post-test loops (DO...WHILE / REPEAT...UNTIL) check after each pass and always run at least once.',
            'FOR is best when the number of repetitions is known in advance; WHILE is best when it depends on a condition.',
            'Every loop needs something inside it that can eventually change the condition, or it will never terminate.'
          ],
          commonMistakes: [
            'Using a WHILE loop when a DO...WHILE is really needed (or vice versa), producing off-by-one behavior.',
            'Forgetting to update the loop\'s counter or condition variable, causing an infinite loop.',
            'Using a FOR loop when the number of repetitions is not actually known in advance.'
          ],
          practicalExample: 'A program validating a PIN should keep asking "Enter PIN" until the user gets it right - since it must ask at least once, DO...WHILE (or REPEAT...UNTIL) fits naturally: DO / READ PIN / WHILE PIN <> CORRECT_PIN.',
          exercise: {
            prompt: 'Decide which loop type (WHILE, FOR, or DO...WHILE) best fits: "print the multiplication table of a number from 1 to 12."',
            guidance: 'FOR is the best fit, because the number of repetitions (12, from 1 to 12) is known in advance before the loop starts.'
          }
        }
      ],
      quiz: [
        { id: 'm6q1', type: 'mcq', topic: 'Control structures', question: 'Which three control structures make up every algorithm?', options: ['Input, Output, Process', 'Sequence, Selection, Repetition', 'Start, Middle, Stop', 'Read, Write, Store'], correct: 1, explanation: 'Every algorithm is built from Sequence, Selection, and Repetition.' },
        { id: 'm6q2', type: 'mcq', topic: 'Sequence', question: '"Sequence" as a control structure means:', options: ['Steps run one after another in order', 'Steps repeat forever', 'Steps run only if a condition is true', 'Steps are chosen randomly'], correct: 0, explanation: 'Sequence means steps execute in order, one after another.' },
        { id: 'm6q3', type: 'mcq', topic: 'Double selection', question: 'A double selection (IF...THEN...ELSE) structure guarantees that:', options: ['Neither block ever runs', 'Both blocks always run', 'Exactly one of the two blocks runs, depending on the condition', 'The condition is checked twice'], correct: 2, explanation: 'IF/ELSE always runs exactly one of its two blocks.' },
        { id: 'm6q4', type: 'scenario', topic: 'Multi-way selection order', question: 'In a grading chain checking ">=70" then ">=60" then ">=50", why must ">=70" be checked first?', options: ['Order does not matter at all', 'Because the chain stops at the first TRUE condition, so a lower threshold checked first would wrongly catch higher scores', 'Because pseudocode requires descending order alphabetically', 'Because ">=70" is always false'], correct: 1, explanation: 'If a lower threshold were checked first, it would incorrectly catch scores that should match a higher threshold.' },
        { id: 'm6q5', type: 'mcq', topic: 'Nested selection', question: 'Nested selection means:', options: ['Two IF structures placed one after another, unrelated', 'One IF structure placed entirely inside another', 'A loop inside a variable', 'A selection structure with no condition'], correct: 1, explanation: 'Nested selection places one IF structure inside another.' },
        { id: 'm6q6', type: 'mcq', topic: 'Pre-test loops', question: 'A "pre-test" loop checks its condition:', options: ['After the loop body runs at least once', 'Before each pass through the loop body', 'Only at the very end of the program', 'Never - pre-test loops have no condition'], correct: 1, explanation: 'Pre-test loops (like WHILE and FOR) check the condition before each pass.' },
        { id: 'm6q7', type: 'mcq', topic: 'Post-test loops', question: 'A DO...WHILE (or REPEAT...UNTIL) loop is different from a WHILE loop because it:', options: ['Never runs its body', 'Always runs its body at least once, since the condition is checked after the pass', 'Can only run exactly once', 'Does not need a condition'], correct: 1, explanation: 'Post-test loops check the condition after the body runs, so the body always executes at least once.' },
        { id: 'm6q8', type: 'tf', topic: 'FOR loop use case', question: 'True or False: A FOR loop is generally the best choice when the exact number of repetitions is not known in advance.', options: ['True', 'False'], correct: 1, explanation: 'FOR is best when the number of repetitions IS known in advance; WHILE suits unknown repetition counts.' },
        { id: 'm6q9', type: 'scenario', topic: 'Choosing a loop', question: 'You need to keep asking a user for a PIN until they enter it correctly, and you must ask at least once. Which loop fits best?', options: ['FOR loop', 'WHILE loop (pre-test)', 'DO...WHILE / REPEAT...UNTIL (post-test)', 'No loop is needed'], correct: 2, explanation: 'A post-test loop guarantees the body (asking for the PIN) runs at least once before the condition is checked.' },
        { id: 'm6q10', type: 'mcq', topic: 'Infinite loop cause', question: 'What almost always causes an unintended infinite loop?', options: ['Using too many variables', 'Something inside the loop failing to ever change the value the condition depends on', 'Using DISPLAY inside a loop', 'Using a FOR loop instead of WHILE'], correct: 1, explanation: 'If nothing inside the loop changes the condition\'s controlling value, the loop can never end.' },
        { id: 'm6q11', type: 'mcq', topic: 'FOR loop syntax', question: 'In "FOR I <- 1 TO 5", how many times does the loop body run?', options: ['4 times', '5 times', '6 times', 'Infinitely'], correct: 1, explanation: 'The loop runs for I = 1, 2, 3, 4, 5 - five times in total.' },
        { id: 'm6q12', type: 'scenario', topic: 'Tracing a FOR loop', question: 'What is displayed by: FOR I <- 1 TO 3; DISPLAY I * 2; ENDFOR ?', options: ['1 2 3', '2 4 6', '2 4 6 8', '3 6 9'], correct: 1, explanation: 'For I=1,2,3: I*2 gives 2, 4, 6.' },
        { id: 'm6q13', type: 'mcq', topic: 'Selection vs repetition', question: 'What is the key difference between selection and repetition as control structures?', options: ['Selection chooses one path; repetition repeats a block of steps', 'They are exactly the same', 'Selection always repeats; repetition never repeats', 'Neither uses a condition'], correct: 0, explanation: 'Selection chooses between paths; repetition repeats a block multiple times.' },
        { id: 'm6q14', type: 'mcq', topic: 'Single selection', question: 'A single selection (IF...THEN with no ELSE) structure:', options: ['Always runs its block', 'Runs its block only if the condition is true, and simply skips it otherwise', 'Runs its block twice', 'Is not allowed in pseudocode'], correct: 1, explanation: 'Single selection conditionally runs a block, with no alternative path if the condition is false.' },
        { id: 'm6q15', type: 'scenario', topic: 'Combining structures', question: 'A menu-driven program uses a loop that keeps showing options and, inside the loop, uses IF/ELSE to decide what to do based on the user\'s choice. This combines which two control structures?', options: ['Sequence and Sequence', 'Selection and Repetition', 'Only Selection', 'Only Repetition'], correct: 1, explanation: 'The loop provides repetition, and the IF/ELSE inside it provides selection - both are used together.' },
        { id: 'm6q16', type: 'mcq', topic: 'Why control structures matter', question: 'Why are Sequence, Selection, and Repetition described as the foundation of every algorithm?', options: ['Because every possible algorithm can be built by combining just these three structures', 'Because they are the only three keywords in any programming language', 'Because they must always appear in that exact order', 'Because computers cannot process more than three steps'], correct: 0, explanation: 'Any algorithm, no matter how complex, can be expressed using combinations of these three fundamental control structures.' }
      ],
      flashcards: [
        { id: 'm6f1', front: 'Sequence', back: 'A control structure where steps run one after another, in order.' },
        { id: 'm6f2', front: 'Selection', back: 'A control structure where the algorithm chooses between two or more paths based on a condition.' },
        { id: 'm6f3', front: 'Repetition', back: 'A control structure where a block of steps runs multiple times.' },
        { id: 'm6f4', front: 'Double selection (IF/ELSE)', back: 'Always runs exactly one of two blocks, depending on whether the condition is true or false.' },
        { id: 'm6f5', front: 'Multi-way selection', back: 'IF/ELSE IF/ELSE chain that checks conditions in order and runs the first block whose condition is true.' },
        { id: 'm6f6', front: 'Pre-test loop', back: 'A loop (e.g. WHILE, FOR) that checks its condition before each pass; may run zero times.' },
        { id: 'm6f7', front: 'Post-test loop', back: 'A loop (e.g. DO...WHILE, REPEAT...UNTIL) that checks its condition after each pass; always runs at least once.' },
        { id: 'm6f8', front: 'FOR loop', back: 'Repeats a block a known number of times, driven by a counter, e.g. FOR I <- 1 TO 10.' },
        { id: 'm6f9', front: 'Nested selection', back: 'One IF structure placed entirely inside another, for decisions that depend on a prior decision.' }
      ]
    }
  ];

  var LAB_PROBLEMS = [
    {
      id: 'lab1',
      moduleId: 1,
      title: 'Clarify a Vague Problem',
      description: 'Practice turning an ill-defined problem into a well-defined one, and walk it through the full problem-solving process.',
      steps: [
        { key: 'input', label: 'Input', content: 'The original request is: "Build something that tells students how they are doing in a course." Decide precisely what input(s) this needs. A strong answer specifies exact inputs, e.g. a list of the student\'s assessment scores and the maximum possible score for each.' },
        { key: 'output', label: 'Output', content: 'Decide precisely what should be displayed. A strong answer specifies something measurable, e.g. the student\'s overall percentage and a performance label such as "Excellent", "Good", "Needs Improvement".' },
        { key: 'conditions', label: 'Conditions', content: 'State the rules connecting input to output. For example: overall percentage = (total scored / total possible) * 100; label is "Excellent" if percentage >= 70, "Good" if >= 50, otherwise "Needs Improvement".' },
        { key: 'algorithm', label: 'Algorithm', content: 'Write the numbered steps: 1. Start. 2. Read the list of scores and maximums. 3. Sum all scores and sum all maximums. 4. Calculate PERCENTAGE = (total score / total maximum) * 100. 5. Decide the label using the conditions above. 6. Display PERCENTAGE and the label. 7. Stop.' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'Convert the algorithm to pseudocode: START / READ scores and maximums / SET TOTAL_SCORE, TOTAL_MAX / SET PERCENTAGE <- (TOTAL_SCORE / TOTAL_MAX) * 100 / IF PERCENTAGE >= 70 THEN ... ELSE IF PERCENTAGE >= 50 THEN ... ELSE ... ENDIF / DISPLAY PERCENTAGE, LABEL / STOP.' },
        { key: 'testing', label: 'Testing', content: 'List at least three test cases, including an edge case. For example: a student who scored everything perfectly (100%), a student right at a boundary (exactly 50%), and a student with a very low score (10%). Confirm each produces the expected label.' }
      ]
    },
    {
      id: 'lab2',
      moduleId: 2,
      title: 'Design a Search Algorithm',
      description: 'Design and compare a linear search algorithm for finding a student\'s name in a class list.',
      steps: [
        { key: 'input', label: 'Input', content: 'Input: a list of student names, and the TARGET name to search for.' },
        { key: 'output', label: 'Output', content: 'Output: whether TARGET was found, and its position in the list if so.' },
        { key: 'conditions', label: 'Conditions', content: 'Compare TARGET to each name in the list, one at a time, from the first position onward, until a match is found or the list is exhausted.' },
        { key: 'algorithm', label: 'Algorithm', content: '1. Start. 2. Read the list and TARGET. 3. Set FOUND to False and POSITION to 0. 4. For each name in the list, in order: if the name equals TARGET, set FOUND to True, record POSITION, and stop checking further. 5. If FOUND is True, display POSITION; otherwise display "Not found". 6. Stop.' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'START / READ LIST, TARGET / SET FOUND <- False / FOR I <- 1 TO LENGTH(LIST) / IF LIST[I] = TARGET THEN SET FOUND <- True, POSITION <- I, EXIT LOOP / ENDIF / ENDFOR / IF FOUND THEN DISPLAY POSITION ELSE DISPLAY "Not found" ENDIF / STOP.' },
        { key: 'testing', label: 'Testing', content: 'Test with: TARGET as the first name (best case), TARGET as the last name (worst case), and a TARGET that does not exist in the list at all (must correctly report "Not found").' }
      ]
    },
    {
      id: 'lab3',
      moduleId: 3,
      title: 'Flowchart a Grading Decision',
      description: 'Design a complete flowchart, symbol by symbol, for converting a numeric score into a letter grade.',
      steps: [
        { key: 'input', label: 'Input', content: 'Input: a numeric SCORE (assume it is always between 0 and 100).' },
        { key: 'output', label: 'Output', content: 'Output: a letter grade - A (70+), B (60-69), C (50-59), or F (below 50).' },
        { key: 'conditions', label: 'Conditions', content: 'Conditions must be checked from the highest threshold down: SCORE >= 70, then SCORE >= 60, then SCORE >= 50, otherwise F.' },
        { key: 'algorithm', label: 'Algorithm', content: 'Describe, symbol by symbol: Start (Oval) -> Read SCORE (Parallelogram) -> Is SCORE>=70? (Diamond) -> Yes: Display "A"; No -> Is SCORE>=60? (Diamond) -> Yes: Display "B"; No -> Is SCORE>=50? (Diamond) -> Yes: Display "C"; No: Display "F" -> all paths merge -> Stop (Oval).' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'START / READ SCORE / IF SCORE >= 70 THEN DISPLAY "A" / ELSE IF SCORE >= 60 THEN DISPLAY "B" / ELSE IF SCORE >= 50 THEN DISPLAY "C" / ELSE DISPLAY "F" / ENDIF / STOP.' },
        { key: 'testing', label: 'Testing', content: 'Test boundary values specifically: 70 (should be A), 69 (should be B), 60 (B), 59 (C), 50 (C), 49 (F). Boundaries are where grading logic most often has bugs.' }
      ]
    },
    {
      id: 'lab4',
      moduleId: 4,
      title: 'Pseudocode a Running Total',
      description: 'Write and trace pseudocode that keeps a running total of numbers entered by a user, stopping on a sentinel value.',
      steps: [
        { key: 'input', label: 'Input', content: 'Input: a sequence of numbers entered one at a time, ending when the user enters -1 (the "sentinel" value).' },
        { key: 'output', label: 'Output', content: 'Output: the total sum of all numbers entered before the -1, and the count of how many numbers were entered.' },
        { key: 'conditions', label: 'Conditions', content: 'Keep reading and adding numbers to the running total while the number entered is not -1. The -1 itself must never be added to the total.' },
        { key: 'algorithm', label: 'Algorithm', content: '1. Start. 2. Set SUM to 0 and COUNT to 0. 3. Read a NUMBER. 4. While NUMBER is not -1: add NUMBER to SUM, add 1 to COUNT, then read the next NUMBER. 5. Display SUM and COUNT. 6. Stop.' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'START / SET SUM <- 0 / SET COUNT <- 0 / READ NUMBER / WHILE NUMBER <> -1 / SET SUM <- SUM + NUMBER / SET COUNT <- COUNT + 1 / READ NUMBER / ENDWHILE / DISPLAY SUM, COUNT / STOP.' },
        { key: 'testing', label: 'Testing', content: 'Trace with inputs 4, 6, 2, -1 (expect SUM=12, COUNT=3), and with just -1 entered immediately (expect SUM=0, COUNT=0, an important edge case).' }
      ]
    },
    {
      id: 'lab5',
      moduleId: 5,
      title: 'Pick Data Types for a Student Record',
      description: 'Work through choosing correct data types and writing the expression to compute a final course grade.',
      steps: [
        { key: 'input', label: 'Input', content: 'A student record needs: full name, matric number, three test scores (each out of 20), and one exam score (out of 40).' },
        { key: 'output', label: 'Output', content: 'Output: the TOTAL score out of 100, and a Boolean HAS_PASSED (true if TOTAL >= 50).' },
        { key: 'conditions', label: 'Conditions', content: 'For each input, state the data type: NAME (String), MATRIC (String), the three test scores and exam score (Integer or Real), TOTAL (Real), HAS_PASSED (Boolean).' },
        { key: 'algorithm', label: 'Algorithm', content: '1. Start. 2. Read NAME, MATRIC, TEST1, TEST2, TEST3, EXAM. 3. Set TOTAL to TEST1 + TEST2 + TEST3 + EXAM. 4. Set HAS_PASSED to (TOTAL >= 50). 5. Display TOTAL and HAS_PASSED. 6. Stop.' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'START / READ NAME, MATRIC, TEST1, TEST2, TEST3, EXAM / SET TOTAL <- TEST1 + TEST2 + TEST3 + EXAM / SET HAS_PASSED <- (TOTAL >= 50) / DISPLAY TOTAL, HAS_PASSED / STOP.' },
        { key: 'testing', label: 'Testing', content: 'Test with scores that sum to exactly 50 (boundary - should pass), scores summing to 49 (should fail), and scores summing to 100 (maximum case).' }
      ]
    },
    {
      id: 'lab6',
      moduleId: 6,
      title: 'Combine Selection and Repetition',
      description: 'Design guided logic for a simple number-guessing validator that combines a loop with a decision inside it.',
      steps: [
        { key: 'input', label: 'Input', content: 'Input: a SECRET number already fixed in the program, and a sequence of GUESS values entered by the user.' },
        { key: 'output', label: 'Output', content: 'Output: "Too high", "Too low", or "Correct!" after each guess; the loop stops once the guess is correct.' },
        { key: 'conditions', label: 'Conditions', content: 'While GUESS is not equal to SECRET: if GUESS > SECRET display "Too high"; if GUESS < SECRET display "Too low"; then read the next GUESS. The loop must always ask for at least one guess, so a post-test structure (DO...WHILE) fits.' },
        { key: 'algorithm', label: 'Algorithm', content: '1. Start. 2. Set SECRET to a fixed value. 3. Do: read GUESS; if GUESS > SECRET display "Too high"; else if GUESS < SECRET display "Too low"; else display "Correct!" - while GUESS is not equal to SECRET. 4. Stop.' },
        { key: 'pseudocode', label: 'Pseudocode', content: 'START / SET SECRET <- 42 / DO / READ GUESS / IF GUESS > SECRET THEN DISPLAY "Too high" / ELSE IF GUESS < SECRET THEN DISPLAY "Too low" / ELSE DISPLAY "Correct!" / ENDIF / WHILE GUESS <> SECRET / STOP.' },
        { key: 'testing', label: 'Testing', content: 'Trace with guesses 10 (Too low), 60 (Too high), 42 (Correct! - loop ends), and confirm the loop asks for a guess at least once even before any comparison happens.' }
      ]
    }
  ];

  var ACHIEVEMENTS = [
    { id: 'first_lesson', title: 'First Lesson', description: 'Complete your very first lesson.', icon: 'book-open' },
    { id: 'first_quiz', title: 'First Quiz', description: 'Submit your first module quiz.', icon: 'clipboard-check' },
    { id: 'problem_solver', title: 'Problem Solver', description: 'Complete your first guided lab problem.', icon: 'puzzle' },
    { id: 'perfect_score', title: 'Perfect Score', description: 'Score 100% on any quiz or the mock examination.', icon: 'star' },
    { id: 'topic_master', title: 'Topic Master', description: 'Score 90% or higher on a module quiz.', icon: 'award' },
    { id: 'exam_ready', title: 'Exam Ready', description: 'Complete a full mock examination.', icon: 'file-check' },
    { id: 'study_streak', title: 'Study Streak', description: 'Study on 3 or more days in a row.', icon: 'flame' },
    { id: 'card_work', title: 'Card Work', description: 'Mark 15 or more flashcards as known.', icon: 'layers' },
    { id: 'halfway', title: 'Halfway There', description: 'Complete 50% or more of all lessons.', icon: 'trending-up' }
  ];

  /* ---------------------------------------------------------------- */
  /* Helper accessors                                                  */
  /* ---------------------------------------------------------------- */
  function getModule(moduleId) {
    moduleId = parseInt(moduleId, 10);
    return MODULES.filter(function (m) { return m.id === moduleId; })[0] || null;
  }

  function getLesson(lessonId) {
    for (var i = 0; i < MODULES.length; i++) {
      var lessons = MODULES[i].lessons;
      for (var j = 0; j < lessons.length; j++) {
        if (lessons[j].id === lessonId) {
          return { lesson: lessons[j], module: MODULES[i], index: j };
        }
      }
    }
    return null;
  }

  function getAllLessons() {
    var all = [];
    MODULES.forEach(function (m) {
      m.lessons.forEach(function (l) { all.push({ lesson: l, module: m }); });
    });
    return all;
  }

  function getAllQuestions() {
    var all = [];
    MODULES.forEach(function (m) {
      m.quiz.forEach(function (q) {
        all.push(Object.assign({}, q, { moduleId: m.id, moduleTitle: m.title }));
      });
    });
    return all;
  }

  function getQuestionsByModule(moduleId) {
    var m = getModule(moduleId);
    if (!m) return [];
    return m.quiz.map(function (q) {
      return Object.assign({}, q, { moduleId: m.id, moduleTitle: m.title });
    });
  }

  function getAllFlashcards() {
    var all = [];
    MODULES.forEach(function (m) {
      m.flashcards.forEach(function (f) {
        all.push(Object.assign({}, f, { moduleId: m.id, moduleTitle: m.title }));
      });
    });
    return all;
  }

  function getFlashcardsByModule(moduleId) {
    var m = getModule(moduleId);
    if (!m) return [];
    return m.flashcards.map(function (f) {
      return Object.assign({}, f, { moduleId: m.id, moduleTitle: m.title });
    });
  }

  function getLabProblem(id) {
    return LAB_PROBLEMS.filter(function (p) { return p.id === id; })[0] || null;
  }

  App.Data = {
    MODULES: MODULES,
    LAB_PROBLEMS: LAB_PROBLEMS,
    ACHIEVEMENTS: ACHIEVEMENTS,
    getModule: getModule,
    getLesson: getLesson,
    getAllLessons: getAllLessons,
    getAllQuestions: getAllQuestions,
    getQuestionsByModule: getQuestionsByModule,
    getAllFlashcards: getAllFlashcards,
    getFlashcardsByModule: getFlashcardsByModule,
    getLabProblem: getLabProblem
  };

})(window.App = window.App || {});
