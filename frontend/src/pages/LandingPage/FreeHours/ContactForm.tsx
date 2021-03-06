import { useState } from 'react';

export default function ContactForm() {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSent(true);
    setMessage('');
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        message,
        'form-name': 'contact',
      }).toString(),
    });
  };

  return (
    <form className="mt-10 px-4" name="contact" onSubmit={handleSubmit}>
      <p className="text-gray-200 text-sm mt-4">
        Löysitkö virheen tai puuttuuko kenttä?
      </p>

      <div className="mx-auto max-w-sm">
        <label htmlFor="message" className="text-gray-500 text-xs block mt-4">
          Voit lähettää alla olevalla lomakkeella mitä tahansa palautetta!
        </label>
        <textarea
          className="w-full mt-2 text-xs text-gray-800 h-20"
          autoComplete="off"
          name="message"
          id="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setIsSent(false);
          }}
        />
        <div className="flex items-center border-b border-gray-700 pb-6 mt-4">
          <div className="text-center flex-grow">
            {isSent && (
              <p className="text-gray-600 text-sm">
                Viesti lähetetty, kiitos palautteesta!
              </p>
            )}
          </div>
          <button
            className="block text-sm border border-green-500 rounded-md px-2 py-1 text-green-500 hover:bg-green-500 hover:text-white"
            disabled={message === ''}
            onClick={() => console.log('sending form', message)}
            type="submit"
          >
            Lähetä
          </button>
        </div>
      </div>
    </form>
  );
}
