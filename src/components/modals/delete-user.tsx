"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteUserModalProps {
    open: boolean;
    onClose: () => void;
    username: string;
    onConfirm: () => void;
}

export const DeleteUserModal = ({ open, onClose, username, onConfirm }: DeleteUserModalProps) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>
                <p>Are you sure you want to delete user <strong>{username}</strong>? This action cannot be undone.</p>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
