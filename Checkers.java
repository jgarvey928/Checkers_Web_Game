package checkers;

import java.awt.*;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import javax.swing.*;

public class Checkers extends JFrame {

    public Checkers() {
        setTitle("Checkerboard");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(400, 400);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        CheckerboardPanel checkerboardPanel = new CheckerboardPanel();
        add(checkerboardPanel, BorderLayout.CENTER);
        add(checkerboardPanel.getStatusLabel(), BorderLayout.SOUTH);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            Checkers checkers = new Checkers();
            checkers.setVisible(true);
        });
    }

    class CheckerboardPanel extends JPanel implements MouseListener {
        private int[][] board = new int[8][8];
        private int selectedRow = -1, selectedCol = -1;
        private boolean isRedTurn = true;
        private JLabel statusLabel;
        private boolean chainJumpInProgress = false;

        public CheckerboardPanel() {
            statusLabel = new JLabel("Red's turn");
            // Initialize board with pieces
            for (int row = 0; row < 8; row++) {
                for (int col = 0; col < 8; col++) {
                    if ((row + col) % 2 == 0) {
                        if (row < 3) {
                            board[row][col] = 1; // Red piece
                        } else if (row > 4) {
                            board[row][col] = 2; // Black piece
                        } else {
                            board[row][col] = 0; // Empty
                        }
                    } else {
                        board[row][col] = 0; // Empty
                    }
                }
            }
            addMouseListener(this);
        }
        
                public JLabel getStatusLabel() {
                    return statusLabel;
                }
        
                @Override
                protected void paintComponent(Graphics g) {
                    super.paintComponent(g);
                    int squareSize = getWidth() / 8;
                    for (int row = 0; row < 8; row++) {
                        for (int col = 0; col < 8; col++) {
                            if ((row + col) % 2 == 0) {
                                g.setColor(Color.BLACK);
                            }
                            else {
                                g.setColor(Color.GREEN);
                            }
                            g.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);
        
                            if (board[row][col] == 1) {
                                g.setColor(Color.RED);
                                g.fillOval(col * squareSize + 2, row * squareSize + 2, squareSize - 4, squareSize - 4);
                            } else if (board[row][col] == 2) {
                                g.setColor(Color.GRAY);
                                g.fillOval(col * squareSize + 2, row * squareSize + 2, squareSize - 4, squareSize - 4);
                            } else if (board[row][col] == 3) { // Red King
                                g.setColor(Color.RED);
                                g.fillOval(col * squareSize + 2, row * squareSize + 2, squareSize - 4, squareSize - 4);
                                g.setColor(Color.WHITE);
                                g.drawString("K", col * squareSize + squareSize / 2 - 4, row * squareSize + squareSize / 2 + 4);
                            } else if (board[row][col] == 4) { // Black King
                                g.setColor(Color.GRAY);
                                g.fillOval(col * squareSize + 2, row * squareSize + 2, squareSize - 4, squareSize - 4);
                                g.setColor(Color.WHITE);
                                g.drawString("K", col * squareSize + squareSize / 2 - 4, row * squareSize + squareSize / 2 + 4);
                            }
        
                            if (row == selectedRow && col == selectedCol) {
                                g.setColor(Color.YELLOW);
                                g.drawOval(col * squareSize + 2, row * squareSize + 2, squareSize - 4, squareSize - 4);
                            }
                        }
                    }
                }
            
                        @Override
            
                        public void mouseClicked(MouseEvent e) {
            
                            int squareSize = getWidth() / 8;
            
                            int col = e.getX() / squareSize;
            
                            int row = e.getY() / squareSize;
            
                            if (row < 0 || row > 7 || col < 0 || col > 7) {
                                return;
                            }
                
            
                            if (chainJumpInProgress) {
                                // If a chain jump is in progress, the only valid action is another jump.
                                if (isValidMove(row, col)) {
                                    movePiece(row, col);
                                }
                            } else {
                                // If no piece is selected, try to select one.
                                if (selectedRow == -1) {
                                    if ((isRedTurn && (board[row][col] == 1 || board[row][col] == 3)) || (!isRedTurn && (board[row][col] == 2 || board[row][col] == 4))) {
                                        selectedRow = row;
                                        selectedCol = col;
                                    }
                                } else {
                                    // If a piece is selected, try to move it.
                                    if (isValidMove(row, col)) {
                                        movePiece(row, col);
                                    } else {
                                        // If the click is not a valid move, treat it as a deselection.
                                        selectedRow = -1;
                                        selectedCol = -1;
                                    }
                                }
                            }
                            repaint();
            
                        }
            
                
            
                        private boolean isValidMove(int row, int col) {
            
                            if (chainJumpInProgress) {
            
                                int rowDiff = Math.abs(row - selectedRow);
            
                                int colDiff = Math.abs(col - selectedCol);
            
                                if (rowDiff != 2 || colDiff != 2) {
            
                                    return false;
            
                                }
            
                            }
            
                
            
                            if (board[row][col] != 0 || (row + col) % 2 != 0) {
            
                                return false; 
            
                            }
            
                            int piece = board[selectedRow][selectedCol];
                            boolean isKing = (piece == 3 || piece == 4);
            
                            int rowDiff = Math.abs(row - selectedRow);
            
                            int colDiff = Math.abs(col - selectedCol);
            
                
            
                            if (!chainJumpInProgress && rowDiff == 1 && colDiff == 1) {
                                if (isKing) {
                                    return true;
                                }
                                if (isRedTurn && row > selectedRow) {
            
                                    return true;
            
                                } else if (!isRedTurn && row < selectedRow) {
            
                                    return true;
            
                                }
            
                            } else if (rowDiff == 2 && colDiff == 2) {
            
                                int jumpedRow = (row + selectedRow) / 2;
            
                                int jumpedCol = (col + selectedCol) / 2;

                                int jumpedPiece = board[jumpedRow][jumpedCol];
            
                                if (isRedTurn && (jumpedPiece == 2 || jumpedPiece == 4)) {
            
                                    return true;
            
                                } else if (!isRedTurn && (jumpedPiece == 1 || jumpedPiece == 3)) {
            
                                    return true;
            
                                }
            
                            }
            
                            return false;
            
                        }
            
                
            
                        private void movePiece(int row, int col) {
            
                            int piece = board[selectedRow][selectedCol];
            
                            board[selectedRow][selectedCol] = 0;
            
                            board[row][col] = piece;

                            // Check for king promotion
                            if (piece == 1 && row == 7) {
                                board[row][col] = 3; // Red king
                            } else if (piece == 2 && row == 0) {
                                board[row][col] = 4; // Black king
                            }
            
                        
            
                            int rowDiff = Math.abs(row - selectedRow);
            
                            if (rowDiff == 2) {
            
                                int jumpedRow = (row + selectedRow) / 2;
            
                                int jumpedCol = (col + selectedCol) / 2;
            
                                board[jumpedRow][jumpedCol] = 0;
            
                        
            
                                if (canJumpFrom(row, col)) {
            
                                    selectedRow = row;
            
                                    selectedCol = col;
            
                                    chainJumpInProgress = true;
            
                                } else {
            
                                    chainJumpInProgress = false;
            
                                }
            
                            } else {
            
                                chainJumpInProgress = false;
            
                            }
            
                        
            
                            if (!chainJumpInProgress) {
            
                                isRedTurn = !isRedTurn;
            
                                updateStatus();
            
                                selectedRow = -1;
            
                                selectedCol = -1;
            
                            }
            
                            checkWinner();
            
                        }
            
                
            
                        private boolean canJumpFrom(int r, int c) {
                            int piece = board[r][c];
                            if (piece == 0) return false;
                            boolean isKing = piece == 3 || piece == 4;
                        
                            // Check jumps for red pieces
                            if (isRedTurn) {
                                if (isKing) { // Red king backward jumps
                                    if (r - 2 >= 0) {
                                        if (c + 2 < 8 && (board[r - 1][c + 1] == 2 || board[r - 1][c + 1] == 4) && board[r - 2][c + 2] == 0) return true;
                                        if (c - 2 >= 0 && (board[r - 1][c - 1] == 2 || board[r - 1][c - 1] == 4) && board[r - 2][c - 2] == 0) return true;
                                    }
                                }
                                // Red pawn/king forward jumps
                                if (r + 2 < 8) {
                                    if (c + 2 < 8 && (board[r + 1][c + 1] == 2 || board[r + 1][c + 1] == 4) && board[r + 2][c + 2] == 0) return true;
                                    if (c - 2 >= 0 && (board[r + 1][c - 1] == 2 || board[r + 1][c - 1] == 4) && board[r + 2][c - 2] == 0) return true;
                                }
                            } else { // Check jumps for black pieces
                                if (isKing) { // Black king backward jumps
                                    if (r + 2 < 8) {
                                        if (c + 2 < 8 && (board[r + 1][c + 1] == 1 || board[r + 1][c + 1] == 3) && board[r + 2][c + 2] == 0) return true;
                                        if (c - 2 >= 0 && (board[r + 1][c - 1] == 1 || board[r + 1][c - 1] == 3) && board[r + 2][c - 2] == 0) return true;
                                    }
                                }
                                // Black pawn/king forward jumps
                                if (r - 2 >= 0) {
                                    if (c + 2 < 8 && (board[r - 1][c + 1] == 1 || board[r - 1][c + 1] == 3) && board[r - 2][c + 2] == 0) return true;
                                    if (c - 2 >= 0 && (board[r - 1][c - 1] == 1 || board[r - 1][c - 1] == 3) && board[r - 2][c - 2] == 0) return true;
                                }
                            }
                        
                            return false;
                        }
            
                
            
                        private void updateStatus() {
            
                            if (isRedTurn) {
            
                                statusLabel.setText("Red's turn");
            
                            } else {
            
                                statusLabel.setText("Black's turn");
            
                            }
            
                        }

        private void checkWinner() {
            boolean redHasPieces = false;
            boolean blackHasPieces = false;
            for (int r = 0; r < 8; r++) {
                for (int c = 0; c < 8; c++) {
                    if (board[r][c] == 1 || board[r][c] == 3) {
                        redHasPieces = true;
                    } else if (board[r][c] == 2 || board[r][c] == 4) {
                        blackHasPieces = true;
                    }
                }
            }

            if (!redHasPieces) {
                statusLabel.setText("Black wins!");
                JOptionPane.showMessageDialog(this, "Black wins!", "Game Over", JOptionPane.INFORMATION_MESSAGE);
                resetGame();
            } else if (!blackHasPieces) {
                statusLabel.setText("Red wins!");
                JOptionPane.showMessageDialog(this, "Red wins!", "Game Over", JOptionPane.INFORMATION_MESSAGE);
                resetGame();
            }
        }

        private void resetGame() {
            for (int row = 0; row < 8; row++) {
                for (int col = 0; col < 8; col++) {
                    if ((row + col) % 2 == 0) {
                        if (row < 3) {
                            board[row][col] = 1; // Red piece
                        } else if (row > 4) {
                            board[row][col] = 2; // Black piece
                        } else {
                            board[row][col] = 0; // Empty
                        }
                    } else {
                        board[row][col] = 0; // Empty
                    }
                }
            }
            isRedTurn = true;
            statusLabel.setText("Red's turn");
            repaint();
        }

        @Override
        public void mousePressed(MouseEvent e) {}

        @Override
        public void mouseReleased(MouseEvent e) {}

        @Override
        public void mouseEntered(MouseEvent e) {}

        @Override
        public void mouseExited(MouseEvent e) {}
    }
}
