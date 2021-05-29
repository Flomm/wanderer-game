export default function addMessage(text: string, type?: string): void {
  const messages: HTMLElement = document.getElementById('messages');
  const newMessage: HTMLParagraphElement = document.createElement('p');
  newMessage.textContent = `- ${text}`;
  newMessage.classList.add('msg');
  if (type) {
    newMessage.classList.add(type);
  }
  messages.appendChild(newMessage);
  messages.scrollTop = messages.scrollHeight;
}
