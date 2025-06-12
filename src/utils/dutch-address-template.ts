
export const dutchAddressContractTemplate = {
  title: "Bedrijfsadres Service Contract",
  description: "Contract voor het verstrekken van bedrijfsadres dienstverlening",
  content: `
<h1>OVEREENKOMST BEDRIJFSADRES DIENSTVERLENING</h1>

<h2>ARTIKEL 1: PARTIJEN</h2>
<p>Deze overeenkomst wordt aangegaan tussen:</p>

<p><strong>Opdrachtgever:</strong><br>
Bedrijfsnaam: {{bedrijfsnaam}}<br>
KvK-nummer: {{kvk_nummer}}<br>
BTW-nummer: {{btw_nummer}}<br>
Contactpersoon: {{contactpersoon}}<br>
E-mail: {{email}}<br>
Telefoon: {{telefoon}}</p>

<p><strong>Opdrachtnemer:</strong><br>
eDutch Management B.V.<br>
KvK-nummer: 34388976<br>
BTW-nummer: NL859733731B01<br>
Adres: Reigersbos 100 P, 1107 ES Amsterdam<br>
E-mail: info@edutchmanagement.nl<br>
Telefoon: +31 (0)20 737 03 85</p>

<h2>ARTIKEL 2: DIENSTVERLENING</h2>
<p>Opdrachtnemer verstrekt aan opdrachtgever een bedrijfsadres voor gebruik als:</p>
<ul>
<li>{{adres_type}}</li>
</ul>

<p><strong>Adres:</strong><br>
{{bedrijfsadres}}</p>

<h2>ARTIKEL 3: VERPLICHTINGEN OPDRACHTNEMER</h2>
<p>Opdrachtnemer verplicht zich tot:</p>
<ul>
<li>Het ter beschikking stellen van bovengenoemd adres voor zakelijke doeleinden</li>
<li>Het ontvangen en bewaren van post en pakketten</li>
<li>{{aanvullende_diensten}}</li>
<li>Het verstrekken van een postadres voor officiële correspondentie</li>
<li>Doorsturen van post volgens afgesproken modaliteiten</li>
</ul>

<h2>ARTIKEL 4: VERPLICHTINGEN OPDRACHTGEVER</h2>
<p>Opdrachtgever verplicht zich tot:</p>
<ul>
<li>Tijdige betaling van de overeengekomen vergoeding</li>
<li>Het verstrekken van juiste en volledige informatie</li>
<li>Naleving van alle toepasselijke wet- en regelgeving</li>
<li>Het niet gebruiken van het adres voor activiteiten die de goede naam van opdrachtnemer kunnen schaden</li>
</ul>

<h2>ARTIKEL 5: VERGOEDING EN BETALING</h2>
<p>Voor de dienstverlening is verschuldigd:</p>
<ul>
<li>Maandelijkse vergoeding: {{maandelijkse_vergoeding}}</li>
<li>Betalingstermijn: {{betalingstermijn}}</li>
<li>Eerste betaling uiterlijk: {{eerste_betaling_datum}}</li>
</ul>

<p>Alle bedragen zijn exclusief BTW, tenzij anders vermeld.</p>

<h2>ARTIKEL 6: LOOPTIJD EN OPZEGGING</h2>
<p>Deze overeenkomst gaat in op {{startdatum}} en wordt aangegaan voor bepaalde tijd tot {{einddatum}}.</p>

<p>Opzegging geschiedt schriftelijk met inachtneming van een opzegtermijn van {{opzegtermijn}}.</p>

<h2>ARTIKEL 7: BIJZONDERE BEPALINGEN</h2>
<p>{{bijzondere_bepalingen}}</p>

<h2>ARTIKEL 8: TOEPASSELIJK RECHT</h2>
<p>Op deze overeenkomst is Nederlands recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechter in Amsterdam.</p>

<h2>ARTIKEL 9: SLOTBEPALINGEN</h2>
<p>Wijzigingen van deze overeenkomst zijn slechts geldig indien schriftelijk overeengekomen.</p>

<p>Deze overeenkomst is opgesteld in tweevoud, waarbij elke partij één exemplaar ontvangt.</p>
  `,
  status: 'active' as const
};
