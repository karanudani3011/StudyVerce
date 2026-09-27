import Quiz from '../models/Quiz.js';

export const seedDefaultQuizzes = async () => {
  try {
    const count = await Quiz.countDocuments();
    if (count > 0) {
      return;
    }

    const sampleQuizzes = [
      {
        title: 'Weekly Quantum Physics Quiz',
        description: 'Test your understanding of wave-particle duality, quantum superposition, and entanglement in this weekly challenge!',
        subject: 'Quantum Physics',
        topic: 'Quantum Mechanics',
        timeLimitMinutes: 10,
        passingScore: 60,
        xpReward: 100,
        isActive: true,
        questions: [
          {
            question: 'What principle states that certain pairs of physical properties cannot both be known to arbitrary precision?',
            options: [
              'Pauli Exclusion Principle',
              'Heisenberg Uncertainty Principle',
              'Planck Hypothesis',
              'Schrodinger Wave Equation'
            ],
            correctAnswer: 1,
            explanation: 'The Heisenberg Uncertainty Principle states that position and momentum cannot simultaneously be precisely measured.',
            points: 25,
            difficulty: 'medium',
            topic: 'Quantum Mechanics'
          },
          {
            question: 'In the double-slit experiment, what pattern appears on the screen when single electrons are fired over time?',
            options: [
              'Two distinct parallel bands',
              'A uniform continuous blur',
              'An interference pattern with alternating bright and dark fringes',
              'A single central dot'
            ],
            correctAnswer: 2,
            explanation: 'Even when electrons are fired one by one, they interfere with themselves, producing an interference pattern.',
            points: 25,
            difficulty: 'easy',
            topic: 'Wave-Particle Duality'
          },
          {
            question: 'Which phenomenon occurs when two particles remain interconnected such that one particle state instantly influences the other?',
            options: [
              'Quantum Tunneling',
              'Quantum Entanglement',
              'Quantum Superposition',
              'Blackbody Radiation'
            ],
            correctAnswer: 1,
            explanation: 'Quantum Entanglement links particles such that the quantum state cannot be described independently.',
            points: 25,
            difficulty: 'medium',
            topic: 'Entanglement'
          },
          {
            question: 'What is the physical significance of the square of the wavefunction |Psi(x,t)|^2 in quantum mechanics?',
            options: [
              'Exact velocity of the electron',
              'Probability density of finding the particle at position x at time t',
              'The electrical charge density',
              'The total kinetic energy of the system'
            ],
            correctAnswer: 1,
            explanation: 'According to Born rule, |Psi(x,t)|^2 represents probability density of locating the quantum particle.',
            points: 25,
            difficulty: 'hard',
            topic: 'Wave Functions'
          }
        ]
      },
      {
        title: 'Data Structures & Algorithms Basics',
        description: 'Comprehensive assessment on Big-O complexity, binary search trees, and graphs.',
        subject: 'Computer Science',
        topic: 'Data Structures',
        timeLimitMinutes: 8,
        passingScore: 60,
        xpReward: 75,
        isActive: true,
        questions: [
          {
            question: 'What is the average time complexity of searching in a balanced Binary Search Tree (BST)?',
            options: [
              'O(1)',
              'O(log n)',
              'O(n)',
              'O(n log n)'
            ],
            correctAnswer: 1,
            explanation: 'A balanced BST halves search space with each comparison, yielding O(log n).',
            points: 25,
            difficulty: 'easy',
            topic: 'Trees'
          },
          {
            question: 'Which data structure uses the LIFO (Last In, First Out) principle?',
            options: [
              'Queue',
              'Stack',
              'Priority Queue',
              'Deque'
            ],
            correctAnswer: 1,
            explanation: 'A Stack strictly follows Last-In First-Out (LIFO) order.',
            points: 25,
            difficulty: 'easy',
            topic: 'Stacks'
          },
          {
            question: 'Which algorithm is typically used to find the shortest path in a weighted graph with non-negative edge weights?',
            options: [
              'Breadth First Search (BFS)',
              'Dijkstra Algorithm',
              'Kruskal Algorithm',
              'Depth First Search (DFS)'
            ],
            correctAnswer: 1,
            explanation: 'Dijkstra algorithm calculates the shortest paths from a source to all other vertices.',
            points: 25,
            difficulty: 'medium',
            topic: 'Graphs'
          },
          {
            question: 'What is the worst-case time complexity of QuickSort?',
            options: [
              'O(n log n)',
              'O(n^2)',
              'O(n)',
              'O(2^n)'
            ],
            correctAnswer: 1,
            explanation: 'When pivot selections are highly unbalanced, QuickSort degrades to O(n^2).',
            points: 25,
            difficulty: 'medium',
            topic: 'Sorting'
          }
        ]
      },
      {
        title: 'Modern Web Development & React Essentials',
        description: 'Assess your skills in React hooks, component lifecycle, virtual DOM, and state management.',
        subject: 'Web Development',
        topic: 'React',
        timeLimitMinutes: 6,
        passingScore: 60,
        xpReward: 60,
        isActive: true,
        questions: [
          {
            question: 'Which React hook should be used to perform side effects such as data fetching or subscriptions?',
            options: [
              'useState',
              'useEffect',
              'useMemo',
              'useRef'
            ],
            correctAnswer: 1,
            explanation: 'useEffect handles side-effects in React function components.',
            points: 20,
            difficulty: 'easy',
            topic: 'Hooks'
          },
          {
            question: 'What is the main purpose of the key prop when rendering lists in React?',
            options: [
              'To style list items uniquely',
              'To help React identify which items have changed, been added, or been removed',
              'To enable keyboard navigation',
              'To automatically sort the array'
            ],
            correctAnswer: 1,
            explanation: 'Keys give React stable identity references during the reconciliation/diffing process.',
            points: 20,
            difficulty: 'easy',
            topic: 'Reconciliation'
          },
          {
            question: 'What will happen if you update state directly without using the setState setter in React?',
            options: [
              'React throws a compile-time syntax error',
              'The component does not re-render and UI becomes desynchronized',
              'React automatically detects the mutation and re-renders',
              'The browser tab crashes'
            ],
            correctAnswer: 1,
            explanation: 'Direct mutations do not trigger React render cycle, causing silent desynchronization.',
            points: 20,
            difficulty: 'medium',
            topic: 'State Management'
          }
        ]
      }
    ];

    await Quiz.insertMany(sampleQuizzes);
    console.log('Default educational quizzes seeded successfully');
  } catch (error) {
    console.error('Error seeding default quizzes:', error.message);
  }
};
