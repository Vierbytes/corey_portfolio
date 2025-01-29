/*
  Resume Window Content

  Now that the actual PDF is in the public folder, I'm using an iframe
  to display it directly in the window. The browser's built-in PDF
  viewer handles the rendering, so it looks just like opening a PDF
  on your computer.

  The download button links to the same file with a "download" attribute
  so clicking it saves the PDF instead of navigating to it.
*/

// Path to the resume PDF in the public folder
// Using encodeURIComponent because the filename has spaces and a comma
const RESUME_PATH = '/Lindsey, Corey Resume.pdf';

function Resume() {
  return (
    <div className="resume">
      {/* Toolbar area - like a PDF viewer toolbar */}
      <div className="resume__toolbar">
        <span className="resume__toolbar-title">📄 Corey_Lindsey_Resume.pdf</span>
        <a
          href={RESUME_PATH}
          download="Corey_Lindsey_Resume.pdf"
          className="resume__download-btn"
        >
          ⬇ Download PDF
        </a>
      </div>

      {/* Embedded PDF viewer - the browser handles rendering the PDF */}
      <div className="resume__preview">
        <iframe
          src={RESUME_PATH}
          className="resume__iframe"
          title="Corey Lindsey Resume"
        />
      </div>
    </div>
  );
}

export default Resume;
