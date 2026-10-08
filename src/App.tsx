import { ServiceCatalog } from "./components/ServiceCatalog";
import { ServiceForm } from "./components/ServiceForm";
import { ServiceHeader } from "./components/ServiceHeader";
import "./App.css";

export default function App() {
  return (
    <main className="shell">
      <ServiceHeader />
      <ServiceForm />
      <ServiceCatalog />
    </main>
  );
}
