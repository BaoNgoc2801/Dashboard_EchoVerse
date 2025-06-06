"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { createRole } from "@/service/role.service";

interface CreateRoleModalProps {
    onClose: () => void;
}

const AVAILABLE_PERMISSIONS = ["BAN_USER", "MUTE_USER", "REPORT", "DELETE_POST", "VIEW_STATS"];

export function CreateRoleModal({ onClose }: CreateRoleModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const { toast } = useToast();

    const togglePermission = (permission: string) => {
        setSelectedPermissions(prev =>
            prev.includes(permission)
                ? prev.filter(p => p !== permission)
                : [...prev, permission]
        );
    };

    const handleSubmit = async () => {
        const success = await createRole({ name, description, permissions: selectedPermissions });

        if (success) {
            toast({ title: "Role created", description: "New role has been added." });
            onClose();
        } else {
            toast({ title: "Error", description: "Failed to create role.", variant: "destructive" });
        }
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input value={description} onChange={e => setDescription(e.target.value)} />
                    </div>
                    <div>
                        <Label>Permissions</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {AVAILABLE_PERMISSIONS.map(permission => (
                                <label key={permission} className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedPermissions.includes(permission)}
                                        onCheckedChange={() => togglePermission(permission)}
                                    />
                                    {permission}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
