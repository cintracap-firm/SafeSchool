# SchoolSafe

SchoolSafe is an Expo presentation demo for school transport safety in Uganda. Its role switcher and floating navigation share a single in-memory simulation.

## Run

Install dependencies with `npm ci`. Run `npm start` for Metro or `npm run web` for the web preview. To use Expo Go over the internet, run `npm run preview -- --go` and share the CLI's QR code or URL while Metro and the tunnel are running.

## Present the demo

1. Open **Home** and show Amina's route.
2. Open **School Admin** and show the blocked assignment.
3. In **FleetCare**, simulate reviewer approval. Return to **School Admin** and publish.
4. Return to **Home** to see the vehicle and driver.
5. In **Live**, advance through boarding and en route, or select Start autoplay. Pause at En route, then simulate a delay to add 12 minutes. The checkpoint labels and ETA are simulated. Open corridor in Google Maps shows real-world directions separately.
6. In **More > Operations assistant**, select **Review journey** to see the rules-based explanation and parent notification draft.
7. Advance to arrival in **Live**. Use the separate attendant control to confirm guardian handover.
8. Use **School Admin > Reset demo** before presenting again.

GPS, inspection, identities and journey events are fictional. The notification is a local draft. Production would require authentication, role-based authorization, consent, encryption, audit logs and secure child-data handling.

## Checks

Run `npm test`, `npm run typecheck`, and `npm run lint`.
