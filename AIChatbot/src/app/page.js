import ChatWidget from '@/components/ChatWidget';

export default function Home() {
  return (
    <main className="website-content">
        <div className="hero">
            <h1>Next-Gen AI Solutions</h1>
            <p>We provide enterprise-grade chatbot systems ranging from simple FAQ rules to complex autonomous agent AI loops. Powered by Next.js & React.</p>
            <button className="cta">Discover More</button>
        </div>
        <ChatWidget />
    </main>
  );
}
