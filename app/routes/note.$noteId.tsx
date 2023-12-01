import { Link, useLoaderData } from "@remix-run/react";
import styles from "../styles/note-details.css";
import { getStoredNotes } from "~/data/note";
import type { LoaderFunction } from "@remix-run/node";
type Note = {
  id: string;
  title: string;
  content: string;
};
export default function NoteDetailsPage() {
  const note = useLoaderData<Note>();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>Note Title</h1>
        <p id="note-details-content">{note.content}</p>
      </header>
    </main>
  );
}

export const loader: LoaderFunction = async ({ params }) => {
  const notes = await getStoredNotes();
  const noteId = params.noteId;

  const selectedNote = notes.find((note: any) => note.id === noteId);

  return selectedNote;
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
