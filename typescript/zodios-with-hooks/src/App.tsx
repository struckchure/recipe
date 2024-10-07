import { useListPlan } from "./hooks";

function App() {
  const { data: plans } = useListPlan();

  return plans?.map((plan, index) => (
    <p key={index}>
      {plan.name} - {plan.currency} {plan.price}
    </p>
  ));
}

export default App;
