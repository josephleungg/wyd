"""merge heads

Revision ID: 7df132a7ff45
Revises: acaf9db8bd6a, 4b71c8561a5f
Create Date: 2025-10-04 11:10:31.506370

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7df132a7ff45'
down_revision: Union[str, Sequence[str], None] = ('acaf9db8bd6a', '4b71c8561a5f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
