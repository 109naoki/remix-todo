import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { getStoredNotes, storeNotes } from "~/data/note";
import { Link, useLoaderData } from "@remix-run/react";
type Note = {
  id: string;
  title: string;
  content: string;
};

export default function NotesPage() {
  const notes = useLoaderData<Note[]>();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

// アロー関数を使用した loader 関数
export const loader = async () => {
  const notes = await getStoredNotes();
  return notes;
};

// アロー関数を使用した action 関数
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);

  if (typeof noteData.title === "string" && noteData.title.length < 5) {
    return { message: "Invalid title - must be at least 5 characters" };
  }

  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  return redirect("/notes");
};

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function ErrorBoundary({ error }: { error: { message: string } }) {
  <main className="error">
    <h1>An Error </h1>
    <p>{error.message}</p>
    <p>
      Back to <Link to="/">safety</Link>
    </p>
  </main>;
}
