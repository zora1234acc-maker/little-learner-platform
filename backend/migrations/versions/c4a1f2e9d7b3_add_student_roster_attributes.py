"""Add student roster attributes

Adds the student year level and class placement to `users`. Both columns are
nullable so existing rows stay valid and no data backfill is required (FR-004,
FR-031).

Revision ID: c4a1f2e9d7b3
Revises: b8997d4343f0
Create Date: 2026-11-09 02:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c4a1f2e9d7b3'
down_revision: Union[str, Sequence[str], None] = 'b8997d4343f0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('year_level', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('class_name', sa.String(length=50), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'class_name')
    op.drop_column('users', 'year_level')
