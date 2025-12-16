import UserInfo from "../UserInfo";

function DashboardChef() {
  return (
    <div>
      <UserInfo />
      <a href="/Agents/Mission">liste des missions</a>
      <a href="/Missions/direct">Assigner une mission</a>
      <a href="/missions/destinataire/">Voir les demandes </a>
      <h2>Tableau de bord Chef</h2>
      ...
    </div>
  );
}

export default DashboardChef;
