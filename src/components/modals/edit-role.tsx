"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserItem } from "@/service/user.service";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditRoleModalProps {
    user: UserItem;
    onClose: () => void;
}

export function EditRoleModal({ user, onClose }: EditRoleModalProps) {
    const [selectedRole, setSelectedRole] = useState<string>(user.roles?.[0]?.name || "USER");

    const handleSave = () => {
        console.log(`Saving role ${selectedRole} for user ${user.username}`);
        // TODO: implement API call
        onClose();
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle>Edit Roles for {user.username}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Label htmlFor="role">Select Role</Label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                        <SelectTrigger id="role" className=" bg-muted bg-black text-foreground">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent className="bg-muted bg-black text-foreground">
                            <SelectItem value="ADMIN">ADMIN</SelectItem>
                            <SelectItem value="USER">USER</SelectItem>
                            <SelectItem value="MOD">MOD</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
