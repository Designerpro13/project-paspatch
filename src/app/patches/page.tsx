

"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApp, Patch } from "@/context/app-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, PlusCircle, MoreHorizontal, ListTodo } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const patchSchema = z.object({
  id: z.string().optional(),
  service: z.string().min(1, "Service name is required."),
  currentVersion: z.string().min(1, "Current version is required."),
  recommendedPatch: z.string().min(1, "Recommended patch is required."),
  rationale: z.string().min(1, "Rationale is required."),
  priority: z.enum(["Critical", "High", "Medium", "Low"]),
});

type PatchFormData = z.infer<typeof patchSchema>;

function PatchForm({ patch, onSave, onCancel }: { patch?: Patch | null, onSave: (data: PatchFormData) => void, onCancel: () => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PatchFormData>({
    resolver: zodResolver(patchSchema),
    defaultValues: patch || { priority: "Medium" },
  });
  
  return (
    <form onSubmit={handleSubmit(onSave)}>
        <DialogHeader>
            <DialogTitle>{patch ? "Edit Patch" : "Create Patch"}</DialogTitle>
            <DialogDescription>
                {patch ? "Update the details for this patch." : "Manually add a new patch to the system."}
            </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service" className="text-right">Service</Label>
                <Input id="service" {...register("service")} className="col-span-3" />
                {errors.service && <p className="col-span-4 text-xs text-destructive text-right">{errors.service.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentVersion" className="text-right">Current Version</Label>
                <Input id="currentVersion" {...register("currentVersion")} className="col-span-3" />
                 {errors.currentVersion && <p className="col-span-4 text-xs text-destructive text-right">{errors.currentVersion.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recommendedPatch" className="text-right">Recommendation</Label>
                <Input id="recommendedPatch" {...register("recommendedPatch")} className="col-span-3" />
                 {errors.recommendedPatch && <p className="col-span-4 text-xs text-destructive text-right">{errors.recommendedPatch.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rationale" className="text-right">Rationale</Label>
                <Textarea id="rationale" {...register("rationale")} className="col-span-3" />
                 {errors.rationale && <p className="col-span-4 text-xs text-destructive text-right">{errors.rationale.message}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">Priority</Label>
                <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Critical">Critical</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
        </div>
        <DialogFooter>
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Patch</Button>
        </DialogFooter>
    </form>
  )
}


export default function PatchesPage() {
  const { patches, createPatch, updatePatch, deletePatch } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPatch, setSelectedPatch] = useState<Patch | null>(null);
  const { toast } = useToast();

  const handleCreate = () => {
    setSelectedPatch(null);
    setIsFormOpen(true);
  };

  const handleEdit = (patch: Patch) => {
    setSelectedPatch(patch);
    setIsFormOpen(true);
  };

  const handleDelete = (patchId: string) => {
    deletePatch(patchId);
    toast({ title: "Patch Deleted", description: "The patch has been removed successfully." });
  };

  const handleSave = (data: PatchFormData) => {
    if (selectedPatch) {
      updatePatch({ ...data, id: selectedPatch.id });
       toast({ title: "Patch Updated", description: "The patch has been updated successfully." });
    } else {
      createPatch(data);
       toast({ title: "Patch Created", description: "The new patch has been added successfully." });
    }
    setIsFormOpen(false);
    setSelectedPatch(null);
  };

  const getBadgeVariant = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Patch Records</CardTitle>
                <CardDescription>
                    Create, edit, and delete patch records for your organization.
                </CardDescription>
            </div>
            <Button onClick={handleCreate}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Patch
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {patches.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Current Version</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Rationale</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patches.map((patch) => (
                  <TableRow key={patch.id}>
                    <TableCell>
                      <Badge variant={getBadgeVariant(patch.priority)}>
                        {patch.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{patch.service}</TableCell>
                    <TableCell>{patch.currentVersion}</TableCell>
                    <TableCell>{patch.recommendedPatch}</TableCell>
                    <TableCell className="max-w-xs truncate">{patch.rationale}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(patch)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                              </DropdownMenuItem>
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                          <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                          <span className="text-destructive">Delete</span>
                                      </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                      <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                          This action cannot be undone. This will permanently delete this patch record.
                                      </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDelete(patch.id)}>Continue</AlertDialogAction>
                                      </AlertDialogFooter>
                                  </AlertDialogContent>
                              </AlertDialog>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
             <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-2">
                <ListTodo className="size-10 mb-2" />
                <h3 className="font-semibold">No Patch Records Found</h3>
                <p className="text-sm">Use the prioritizer to generate patch recommendations automatically.</p>
                <Button asChild variant="link" className="text-sm">
                    <Link href="/prioritize">Go to Prioritize Patches</Link>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
            <PatchForm 
                patch={selectedPatch} 
                onSave={handleSave}
                onCancel={() => setIsFormOpen(false)}
            />
        </DialogContent>
      </Dialog>
    </div>
  );
}
