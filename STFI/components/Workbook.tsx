'use client'

import { useState, useEffect } from 'react'

interface FormData {
  [key: string]: string
}

interface OpenLessons {
  [key: string]: boolean
}

const riseModules: { [key: string]: string } = {
  '1.2': 'https://360.articulate.com/review/content/c7e1d116-ddd6-4738-abbd-caf5540ca806/review',
  '1.3': 'https://360.articulate.com/review/content/3c882266-dbf3-4d08-9d63-d1eda5e23546/review',
  '1.4': 'https://360.articulate.com/review/content/2c3ac20b-7114-4c4c-99d6-7b7c73dcf3ae/review',
  '2.1': 'https://360.articulate.com/review/content/1a96ffbe-7af7-4057-acd4-6937bd1e327c/review',
  '2.2': 'https://360.articulate.com/review/content/eef3663f-b051-4414-8863-c713871f85c1/review',
  '3.1': 'https://360.articulate.com/review/content/00c63d58-d9ac-4469-8859-7d9bae8af125/review',
  '3.2': 'https://360.articulate.com/review/content/0cab3366-d1c6-4ab3-9e1b-5253d05b9db9/review',
  '4.1': 'https://360.articulate.com/review/content/b838ecf0-8b11-456c-8748-9d178d6e229b/review',
  '4.2': 'https://360.articulate.com/review/content/9cf84b18-75ab-4f9e-9df7-5a064ba6eea3/review',
}

export default function Workbook() {
  const [openLessons, setOpenLessons] = useState<OpenLessons>({})
  const [visitedLessons, setVisitedLessons] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState<FormData>({})

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('workbook_data')
    if (saved) {
      try {
        setFormData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load workbook data:', e)
      }
    }
  }, [])

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('workbook_data', JSON.stringify(formData))
  }, [formData])

  const toggleLesson = (lessonId: string) => {
    setOpenLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }))
    setVisitedLessons((prev) => new Set([...prev, lessonId]))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="workbook-wrapper">
      <header className="header">
        <div className="container">
          <h1>Storytelling for Impact</h1>
          <p>Interactive Workbook</p>
        </div>
      </header>

      <div className="container">
        <div className="progress-bar">
          <div className="progress-text">
            Progress: {visitedLessons.size} of 4 lessons explored
          </div>
          <div className="progress-checkmarks">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`checkpoint ${visitedLessons.has(`lesson${num}`) ? 'visited' : ''}`}
              >
                {visitedLessons.has(`lesson${num}`) ? '✓' : num}
              </div>
            ))}
          </div>
        </div>

        <div className="intro-section">
          <h2>Welcome to Storytelling for Impact</h2>
          <p>
            This interactive workbook will help you harness the power of storytelling to amplify voices
            and values that strengthen inclusion and drive meaningful change across your campus community and beyond.
          </p>
          <p style={{ marginTop: '1rem' }}>
            Whether you're sharing your own experiences, advocating for a program, or seeking to influence
            policy or culture, the right story told well can connect, inspire, and move people to act.
          </p>
          <p style={{ marginTop: '1rem', fontWeight: '600', color: '#E66C5C' }}>
            ✅ Your work is now being saved automatically as you type!
          </p>
        </div>

        {/* LESSON 1 */}
        <div className="lesson-section">
          <div className="lesson-header" onClick={() => toggleLesson('lesson1')}>
            <h2>Lesson 1: Why Storytelling</h2>
            <div className={`lesson-chevron ${openLessons.lesson1 ? 'open' : ''}`}>▼</div>
          </div>
          <div className={`lesson-content ${openLessons.lesson1 ? 'open' : ''}`}>
            <div className="lesson-inner">
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                This module explores the essential question: <em>Why storytelling?</em> You'll consider how stories
                shape identity, build connection, and create cultural memory, both personally and institutionally.
              </p>

              {/* 1.1 Workbook-only */}
              <div className="sub-lesson">
                <h3>1.1: Why Stories?</h3>
                <p>
                  Stories have been used for centuries to teach, persuade, and build community, but why are they
                  so effective? In this lesson, you'll uncover why stories stay with us, how they inspire action,
                  and why they're especially powerful tools for leading change.
                </p>
                <div className="workbook-activity">
                  <h4>📝 Workbook Activity</h4>
                  <div className="form-group">
                    <label>Reflect: What makes a story memorable to you?</label>
                    <textarea
                      placeholder="Type your thoughts here..."
                      value={formData['1.1_reflection'] || ''}
                      onChange={(e) => handleInputChange('1.1_reflection', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 1.2 Rise Module */}
              <div className="sub-lesson">
                <h3>1.2: Benefits of Strategic Storytelling</h3>
                <p>
                  Not all stories are equally effective. This lesson introduces five specific benefits of
                  <strong> strategic</strong> storytelling and invites you to consider which of these outcomes
                  matters most to your current goals.
                </p>
                <a href={riseModules['1.2']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 1.3 Rise Module */}
              <div className="sub-lesson">
                <h3>1.3: Narrative Identity</h3>
                <p>
                  The previous lesson highlighted several ways that stories can open us up to the perspectives
                  or experiences of others. In this lesson, you'll look more closely at the ways stories shape
                  our understanding of ourselves.
                </p>
                <a href={riseModules['1.3']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 1.4 Rise Module + Workbook */}
              <div className="sub-lesson">
                <h3>1.4: Choosing Your Story</h3>
                <p>
                  Now that you've seen what stories can do, it's time to think about the story <strong>you</strong> want
                  to tell. In this lesson, you'll review prompts, reflect on your goals, and choose a story idea
                  that you'll carry through the rest of the course.
                </p>
                <a href={riseModules['1.4']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
                <div className="workbook-activity">
                  <h4>📝 Workbook Activity</h4>
                  <div className="form-group">
                    <label>"I want to tell a story about..."</label>
                    <input
                      type="text"
                      placeholder="The topic"
                      value={formData['1.4_topic'] || ''}
                      onChange={(e) => handleInputChange('1.4_topic', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>"...so that I can..."</label>
                    <input
                      type="text"
                      placeholder="The outcome"
                      value={formData['1.4_outcome'] || ''}
                      onChange={(e) => handleInputChange('1.4_outcome', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON 2 */}
        <div className="lesson-section">
          <div className="lesson-header" onClick={() => toggleLesson('lesson2')}>
            <h2>Lesson 2: The Science of Stories</h2>
            <div className={`lesson-chevron ${openLessons.lesson2 ? 'open' : ''}`}>▼</div>
          </div>
          <div className={`lesson-content ${openLessons.lesson2 ? 'open' : ''}`}>
            <div className="lesson-inner">
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                In this module, you'll explore what happens in the brain when listening to a well-told story.
                You'll learn why stories capture attention, evoke empathy, increase memory, and even boost
                perceived value.
              </p>

              {/* 2.1 Rise Module */}
              <div className="sub-lesson">
                <h3>2.1: Neuroscience of Stories</h3>
                <p>
                  Storytelling may be an art form, but it's also a brain-based strategic skill set. In this lesson,
                  you'll discover what happens in the brain when we hear a story and why narrative activates attention,
                  memory, empathy, and trust in ways that data alone cannot.
                </p>
                <a href={riseModules['2.1']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 2.2 Rise Module */}
              <div className="sub-lesson">
                <h3>2.2: Applying Story Science</h3>
                <p>
                  Now that you understand how stories affect the brain, this lesson will walk you through four
                  techniques to apply that knowledge and make your stories more engaging and persuasive.
                </p>
                <a href={riseModules['2.2']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 2.3 Workbook-only */}
              <div className="sub-lesson">
                <h3>2.3: Define Your Story's Impact</h3>
                <p>
                  In this final lesson of this module, you'll bring together everything you've learned to clarify
                  the story you want to tell and the change you hope it will create.
                </p>
                <div className="workbook-activity">
                  <h4>📝 Workbook Activity</h4>
                  <div className="form-group">
                    <label>What specific change or action do you hope your story will inspire?</label>
                    <textarea
                      placeholder="Type your response here..."
                      value={formData['2.3_impact'] || ''}
                      onChange={(e) => handleInputChange('2.3_impact', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON 3 */}
        <div className="lesson-section">
          <div className="lesson-header" onClick={() => toggleLesson('lesson3')}>
            <h2>Lesson 3: Creating Good Stories</h2>
            <div className={`lesson-chevron ${openLessons.lesson3 ? 'open' : ''}`}>▼</div>
          </div>
          <div className={`lesson-content ${openLessons.lesson3 ? 'open' : ''}`}>
            <div className="lesson-inner">
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                You've identified your story and defined its intended impact, so it's time to shape the story itself.
                This module helps you identify how good stories work and how to make yours engaging, clear, and powerful.
              </p>

              {/* 3.1 Rise Module */}
              <div className="sub-lesson">
                <h3>3.1: Evaluating Stories for Impact</h3>
                <p>
                  How do you know if a story is working? In this lesson, you'll analyze real story excerpts and
                  identify what makes them effective (or not).
                </p>
                <a href={riseModules['3.1']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 3.2 Rise Module */}
              <div className="sub-lesson">
                <h3>3.2: Story Architecture</h3>
                <p>
                  What makes a story feel satisfying and complete? You're already familiar with the fundamental
                  arc of a story. Now, it's time to explore some of the most common and effective story structures.
                </p>
                <a href={riseModules['3.2']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 3.3 Workbook-only */}
              <div className="sub-lesson">
                <h3>3.3: Draft Your Storyboard</h3>
                <p>
                  You've explored how stories are structured and practiced analyzing what works. Now it's time to
                  draft your own. You'll begin building a storyboard: a visual or written outline of the key moments,
                  transitions, and meaning of your story.
                </p>
                <div className="workbook-activity">
                  <h4>📝 Workbook Activity: Three-Act Storyboard</h4>
                  <table className="table-input">
                    <thead>
                      <tr>
                        <th>Act</th>
                        <th>Key Moments</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <strong>Act I</strong>
                          <br />
                          Set up the story
                        </td>
                        <td>
                          <textarea
                            placeholder="Introduce the situation, characters, and problem..."
                            value={formData['3.3_act1'] || ''}
                            onChange={(e) => handleInputChange('3.3_act1', e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Act II</strong>
                          <br />
                          Respond and struggle
                        </td>
                        <td>
                          <textarea
                            placeholder="Describe how characters responded, roadblocks, surprises..."
                            value={formData['3.3_act2'] || ''}
                            onChange={(e) => handleInputChange('3.3_act2', e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <strong>Act III</strong>
                          <br />
                          Solution / Life change
                        </td>
                        <td>
                          <textarea
                            placeholder="Describe the turning point, resolution, what changed..."
                            value={formData['3.3_act3'] || ''}
                            onChange={(e) => handleInputChange('3.3_act3', e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LESSON 4 */}
        <div className="lesson-section">
          <div className="lesson-header" onClick={() => toggleLesson('lesson4')}>
            <h2>Lesson 4: Delivering Powerful Stories</h2>
            <div className={`lesson-chevron ${openLessons.lesson4 ? 'open' : ''}`}>▼</div>
          </div>
          <div className={`lesson-content ${openLessons.lesson4 ? 'open' : ''}`}>
            <div className="lesson-inner">
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                In this module, you'll focus on shaping your storytelling style. This includes the expressive choices
                that influence how your story feels, sounds, and resonates with your audience.
              </p>

              {/* 4.1 Rise Module */}
              <div className="sub-lesson">
                <h3>4.1: Crafting Your Storytelling Style</h3>
                <p>
                  <strong>How</strong> you tell your story is just as important as <strong>what</strong> your story says.
                  In this lesson, you'll explore five key elements of storytelling style: voice, tone, framing,
                  emotional rhythm, and flow.
                </p>
                <a href={riseModules['4.1']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 4.2 Rise Module */}
              <div className="sub-lesson">
                <h3>4.2: Vulnerability and Authenticity</h3>
                <p>
                  Many powerful stories include moments of vulnerability, but that doesn't mean that every story you
                  tell requires a raw, confessional quality. This lesson will help you reflect on how to share with
                  authenticity while maintaining boundaries.
                </p>
                <a href={riseModules['4.2']} target="_blank" rel="noopener noreferrer" className="rise-module-link">
                  Launch Module (opens in new tab)
                </a>
              </div>

              {/* 4.3 Workbook-only */}
              <div className="sub-lesson">
                <h3>4.3: Tailor Your Storyboard</h3>
                <p>
                  You've shaped your story, refined your style, and aligned your message to your values. Now it's
                  time to bring it all together and make it resonate with the people who need to hear it.
                </p>
                <div className="workbook-activity">
                  <h4>📝 Workbook Activity: Audience Adaptation</h4>
                  <div className="form-group">
                    <label>Audience #1: Who are they?</label>
                    <input
                      type="text"
                      placeholder="E.g., Senior leadership, students, peers..."
                      value={formData['4.3_audience1'] || ''}
                      onChange={(e) => handleInputChange('4.3_audience1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>How would you adapt your story for this audience?</label>
                    <textarea
                      placeholder="Consider tone, structure, emotional rhythm..."
                      value={formData['4.3_adapt1'] || ''}
                      onChange={(e) => handleInputChange('4.3_adapt1', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONCLUSION */}
        <div className="conclusion-section">
          <h2>Thank You</h2>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
            Thank you for exploring this interactive workbook of Storytelling for Impact.
            We hope it has helped you discover new ways to shape, share, and apply your own stories.
          </p>
          <p style={{ marginTop: '1rem' }}>
            Your work as a storyteller is part of a larger, shared effort to transform communities
            and institutions from the inside out.
          </p>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', opacity: '0.8' }}>
            Course materials developed by Story As and Jackrabbit LX
          </p>
        </div>
      </div>
    </div>
  )
}
