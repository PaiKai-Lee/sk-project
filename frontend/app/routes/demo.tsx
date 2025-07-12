import { Button } from '~/components/ui/button';
import type { Route } from './+types/demo';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'lucide-react';
import { usePreference } from '~/context/preference';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'demo' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export async function clientLoader({}: Route.ClientLoaderArgs) {
  return { data: 'data', time: Date.now() };
}

export default function Demo({ loaderData }: Route.ComponentProps) {
  const { theme, setTheme } = usePreference();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectNumber, setSelectNumber] = useState<number | null>(null);
  function handleToggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
    toast.success('Theme changed');
  }

  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    const number = Number(e.currentTarget.dataset.number);
    setSelectNumber(number);
    setDialogOpen(true);
  }

  const dataQuery = useQuery({
    queryKey: ['data', selectNumber],
    enabled: !!selectNumber,
    queryFn: async () => {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${selectNumber}/comments`
      );
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
  });

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5">
      <Button onClick={handleToggleTheme}>Click me</Button>
      <hr />
      <Button data-number={1} onClick={clickHandler}>
        Open
      </Button>
      <Button data-number={2} onClick={clickHandler}>
        Open2
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure? {selectNumber}</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to permanently
              delete this file from our servers?
            </DialogDescription>
          </DialogHeader>
          {/* {dataQuery.isError && <p>{dataQuery.error.message}</p>}
          {dataQuery.isLoading && <p>Loading...</p>} */}
          <Table>
            <tbody>
              {dataQuery.data?.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.body}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
